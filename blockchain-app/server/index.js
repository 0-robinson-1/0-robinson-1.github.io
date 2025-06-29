// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Pull in your connection string and container name
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// Ensure the container exists
async function ensureContainer() {
  await containerClient.createIfNotExists();
}

app.post("/api/save-wallet", async (req, res) => {
  const { id, data } = req.body;
  if (!id || !data) {
    return res.status(400).json({ error: "Missing id or data" });
  }
  try {
    await ensureContainer();
    const blob = containerClient.getBlockBlobClient(`wallets/${id}.json`);
    const content = Buffer.from(JSON.stringify(data));
    await blob.upload(content, content.length);
    res.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server listening on http://localhost:${PORT}`);
});