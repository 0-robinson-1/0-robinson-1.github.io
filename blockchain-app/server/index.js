// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";

dotenv.config();

const app = express();
// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://0-robinson-1.github.io']
  : ['http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  }
}));
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
  const { alias, publicKey } = data;
  const id = alias;
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

  // Try the simple path first
  try {
    const text = await fetchBlob(`${id}.json`);
    return res.json(JSON.parse(text));
  } catch (primaryErr) {
    console.debug(`Primary fetch failed for ${id}.json:`, primaryErr.message);
  }

  // Fallback: find by metadata.alias or embedded alias in blob content
  for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
    // Check metadata first
    if (blob.metadata?.alias === id) {
      const text = await fetchBlob(blob.name);
      return res.json(JSON.parse(text));
    }
    // Check inside blob JSON
    try {
      const content = await fetchBlob(blob.name);
      const data = JSON.parse(content);
      if (data.alias === id) {
        return res.json(data);
      }
    } catch {
      // skip parse errors
    }
  }

  console.error("Wallet not found:", id);
  return res.status(404).json({ error: "Wallet not found" });
});

// List all wallets
app.get("/api/list-wallets", async (_req, res) => {
  try {
    // Include metadata so we can list the user-defined alias if set
    const iter = containerClient.listBlobsFlat({ includeMetadata: true });
    const ids = [];
    for await (const blob of iter) {
      // Prefer the alias metadata, fall back to filename
      const alias = blob.metadata?.alias || blob.name.replace(/\.json$/, "");
      ids.push(alias);
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