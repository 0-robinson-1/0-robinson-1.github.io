// src/storage.ts

/**
 * Persist wallet data by POSTing to Node server.
 */
export async function saveWallet(id: string, data: object) {
  try {
    const res = await fetch('/api/save-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.error || res.statusText);
    }
    return await res.json();
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}`);
  }
}