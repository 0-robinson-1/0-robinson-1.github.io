// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

// Pull in your connection string and container name
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// Ensure the container exists on startup
async function ensureContainer() {
  await containerClient.createIfNotExists();
}
ensureContainer().catch(console.error);

app.post("/api/save-wallet", async (req, res) => {
  const { id, data } = req.body;
  if (!id || !data) {
    return res.status(400).json({ error: "Missing id or data" });
  }
  try {
    const blob = containerClient.getBlockBlobClient(`wallets/${id}.json`);
    const content = Buffer.from(JSON.stringify(data));
    await blob.upload(content, content.length);
    res.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single wallet by ID
app.get('/api/get-wallet/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blobClient = containerClient.getBlockBlobClient(`wallets/${id}.json`);
    const downloadBuffer = await blobClient.downloadToBuffer();
    const text = downloadBuffer.toString();
    const data = JSON.parse(text);
    res.json(data);
  } catch (e) {
    console.error("Download error:", e);
    res.status(404).json({ error: "Wallet not found" });
  }
});

// List all wallet IDs
app.get('/api/list-wallets', async (_req, res) => {
  try {
    const iter = containerClient.listBlobsFlat({ prefix: 'wallets/' });
    const ids = [];
    for await (const blob of iter) {
      const name = blob.name.replace(/^wallets\//, '').replace(/\.json$/, '');
      ids.push(name);
    }
    res.json(ids);
  } catch (e) {
    console.error("List error:", e);
    res.status(500).json({ error: "Could not list wallets" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server listening on http://localhost:${PORT}`);
});