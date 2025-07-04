// src/storage.ts

export interface SaveResult { success: true }

/**
 * Persist wallet data by POSTing to Node server.
 */
export async function saveWallet(data: object): Promise<SaveResult> {
  try {
    const res = await fetch('/api/save-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
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
 * Load one wallet by ID.
 */
export async function getWallet(id: string): Promise<WalletData> {
  const res = await fetch(`/api/get-wallet/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to load wallet ${id}`);
  return res.json();
}

/**
 * List all wallet IDs.
 */
export async function listWallets(): Promise<string[]> {
  const res = await fetch(`/api/list-wallets`);
  if (!res.ok) throw new Error(`Failed to list wallets`);
  return res.json();
}