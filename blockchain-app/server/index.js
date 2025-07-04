// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health-check
app.get("/", (_req, res) => res.send("✅ Server running"));

// Azure setup
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// Ensure container exists once
async function ensureContainer() {
  await containerClient.createIfNotExists();
}
ensureContainer().catch(console.error);

// Save wallet
app.post("/api/save-wallet", async (req, res) => {
  const { data } = req.body;
  const { publicKey: id, alias } = data;
  if (!id || !data || !alias) {
    return res.status(400).json({ error: "Missing id, data, or alias" });
  }
  try {
    // <-- FIXED: store at container root
    const blobClient = containerClient.getBlockBlobClient(`${id}.json`);
    const content   = Buffer.from(JSON.stringify(data));
    await blobClient.upload(content, content.length, {
      metadata: { alias }
    });
    res.json({ success: true });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Get one wallet
app.get("/api/get-wallet/:id", async (req, res) => {
  const { id } = req.params;
  async function fetchBlob(path) {
    const client = containerClient.getBlockBlobClient(path);
    const buffer = await client.downloadToBuffer();
    return buffer.toString();
  }

  try {
    // Try root path first
    const text = await fetchBlob(`${id}.json`);
    return res.json(JSON.parse(text));
  } catch (_) {
    try {
      // Fallback to old prefix
      const text = await fetchBlob(`wallets/${id}.json`);
      return res.json(JSON.parse(text));
    } catch (e) {
      console.error("Download error:", e);
      return res.status(404).json({ error: "Wallet not found" });
    }
  }
});

// List all wallets
app.get("/api/list-wallets", async (_req, res) => {
  try {
    // <-- FIXED: list at container root
    const iter = containerClient.listBlobsFlat();
    const ids = [];
    for await (const blob of iter) {
      ids.push(blob.name.replace(/\.json$/, ""));
    }
    res.json(ids);
  } catch (e) {
    console.error("List error:", e);
    res.status(500).json({ error: "Could not list wallets" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🟢 Server listening on http://localhost:${PORT}`)
);