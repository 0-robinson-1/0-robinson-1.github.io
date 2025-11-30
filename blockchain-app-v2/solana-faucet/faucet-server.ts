// faucet-server.ts
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import fs from "fs";
import os from "os";
import path from "path";
import http from "http";

const connection = new Connection("https://api.testnet.solana.com", "confirmed");

const faucetKeypair = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "faucet-keypair.json"), "utf8")))
);

const MINT = new PublicKey("J4QzC5vdV7atHXnEwXQgYDniuPtVCJeiEhFFqgjCvftQ");
const TOKENS_PER_REQUEST = 1_000_000_000n; // 1 token (9 decimals)

const usedIps = new Set<string>();

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Token-2022 Testnet Faucet is LIVE\nPOST /request { \"address\": \"YOUR_WALLET\" }");
  }

  if (req.method !== "POST" || req.url !== "/request") {
    res.writeHead(404);
    return res.end("Not found");
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    let address: string;
    try {
      const json = JSON.parse(body);
      address = json.address?.trim();
      if (!address) throw new Error("missing address");
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid JSON or missing address" }));
    }

    // Get IP safely
    const forwarded = req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0] || req.socket.remoteAddress || "unknown";

    if (usedIps.has(ip)) {
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Already requested once" }));
    }

    try {
      const recipient = new PublicKey(address);

      const faucetAta = await getOrCreateAssociatedTokenAccount(
        connection,
        faucetKeypair,
        MINT,
        faucetKeypair.publicKey,
        false,
        "confirmed",
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      const recipientAta = await getOrCreateAssociatedTokenAccount(
        connection,
        faucetKeypair,
        MINT,
        recipient,
        true,
        "confirmed",
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      const sig = await transfer(
        connection,
        faucetKeypair,
        faucetAta.address,
        recipientAta.address,
        faucetKeypair,
        TOKENS_PER_REQUEST,
        [],
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      usedIps.add(ip);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          tx: `https://solscan.io/tx/${sig}?cluster=testnet`,
          amount: "1 token",
        })
      );
    } catch (e: any) {
      console.error("Error:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message || "Transaction failed" }));
    }
  });
});

server.listen(3000, () => console.log("Faucet is LIVE → http://localhost:3000"));