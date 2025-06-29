// src/storage.ts
import { BlobServiceClient } from "@azure/storage-blob";


// Ensure your .env has VITE_ prefixes so Vite can inject these:
const connectionString = import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING!;
const containerName    = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME!;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient   = blobServiceClient.getContainerClient(containerName);

// Ensure the container exists before any upload
async function ensureContainerExists() {
  await containerClient.createIfNotExists();
}

/**
 * Persist wallet data to Azure Blob Storage under wallets/<id>.json
 */
export async function saveWallet(id: string, data: object) {
  await ensureContainerExists();
  const blobClient = containerClient.getBlockBlobClient(`wallets/${id}.json`);
  const content = Buffer.from(JSON.stringify(data));
  await blobClient.upload(content, content.length);
}

export { containerClient };