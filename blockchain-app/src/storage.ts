// src/storage.ts
import { BlobServiceClient } from "@azure/storage-blob";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName    = process.env.AZURE_STORAGE_CONTAINER_NAME!;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient   = blobServiceClient.getContainerClient(containerName);

// Ensure the container exists
await containerClient.createIfNotExists();

export { containerClient };