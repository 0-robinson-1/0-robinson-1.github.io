// src/storage.ts

/**
 * Persist wallet data by POSTing to Node server.
 */
export async function saveWallet(id: string, data: object) {
  const res = await fetch('/api/save-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, data }),
  });

  if (!res.ok) {
    // Try to read an error message from the response body
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || res.statusText);
  }

  return res.json(); // { success: true } (or whatever your server returns)
}