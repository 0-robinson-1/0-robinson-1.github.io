import { containerClient } from "./storage";

async function listBlobs() {
  console.log("Blobs in container:");
  for await (const blob of containerClient.listBlobsFlat()) {
    console.log("  –", blob.name);
  }
}

listBlobs().catch(console.error);