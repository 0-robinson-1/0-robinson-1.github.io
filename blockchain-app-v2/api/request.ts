// api/request.ts  ← Vercel serverless API route for the faucet
import { NextRequest, NextResponse } from 'next/server';  // Vercel uses Next.js runtime
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const connection = new Connection("https://api.testnet.solana.com", "confirmed");

// Load keypair from env var (Vercel) or fallback to local file (local dev)
let faucetSecretKey: Uint8Array;
if (process.env.FAUCET_KEYPAIR) {
  faucetSecretKey = Uint8Array.from(JSON.parse(process.env.FAUCET_KEYPAIR));
} else {
  // Local fallback (remove for pure Vercel)
  const fs = await import("fs");
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  faucetSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync(path.join(__dirname, "../../faucet-keypair.json"), "utf8")));
}
const faucetKeypair = Keypair.fromSecretKey(faucetSecretKey);

const MINT = new PublicKey("J4QzC5vdV7atHXnEwXQgYDniuPtVCJeiEhFFqgjCvftQ");
const TOKENS_PER_REQUEST = 1_000_000_000n; // 1 token (9 decimals)

// Simple in-memory rate-limit (resets on cold starts; fine for testnet/low traffic)
const usedIps = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const address = body.address?.trim();
    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown';
    if (usedIps.has(ip)) {
      return NextResponse.json({ error: "Already requested once" }, { status: 429 });
    }

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
    return NextResponse.json({
      success: true,
      tx: `https://solscan.io/tx/${sig}?cluster=testnet`,
      amount: "1 token",
    });
  } catch (e: any) {
    console.error("Error:", e);
    return NextResponse.json({ error: e.message || "Transaction failed" }, { status: 500 });
  }
}

// Optional: GET /api/request for a simple status message
export async function GET() {
  return NextResponse.json({ message: "Token-2022 Testnet Faucet is LIVE – POST { \"address\": \"...\" }" });
}