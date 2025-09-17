// src/storage.ts

export interface SaveResult { success: true }

/**
 * Persist wallet data by POSTing to Node server.
 */
export async function saveWallet(blob: WalletBlob): Promise<SaveResult> {
  try {
    const apiBaseUrl = 'https://0-robinson-1-github-io.vercel.app/api'; // Direct Vercel URL (no env needed)
    console.log('Using API base for saveWallet:', apiBaseUrl); // Debug log to confirm update
    const res = await fetch(`${apiBaseUrl}/save-wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: blob.alias,
        data: blob
      }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.error || res.statusText);
    }
    return await res.json();
  } catch (networkErr: any) {
    throw new Error(`Network error: ${networkErr.message}`);
  }
}

export interface WalletData { [key: string]: any }

/**
 * A blob representing an encrypted wallet stored remotely.
 */
export interface WalletBlob {
  alias: string;
  publicKey: string;
  secretKey: string;
}

/**
 * Information about a stored wallet, e.g. its alias or ID.
 * Here, listWallets returns an array of wallet IDs (strings).
 */
export type WalletInfo = string;

/**
 * Load one wallet by ID.
 */
export async function getWallet(id: string): Promise<WalletData> {
  const apiBaseUrl = 'https://0-robinson-1-github-io.vercel.app/api'; // Direct Vercel URL
  console.log('Using API base for getWallet:', apiBaseUrl); // Debug log
  const res = await fetch(`${apiBaseUrl}/get-wallet/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to load wallet ${id}`);
  return res.json();
}

/**
 * List all wallet IDs.
 */
export async function listWallets(): Promise<string[]> {
  const apiBaseUrl = 'https://0-robinson-1-github-io.vercel.app/api'; // Direct Vercel URL
  console.log('Using API base for listWallets:', apiBaseUrl); // Debug log
  const res = await fetch(`${apiBaseUrl}/list-wallets`);
  if (!res.ok) throw new Error(`Failed to list wallets`);
  return res.json();
}