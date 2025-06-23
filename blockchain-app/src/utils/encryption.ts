// blockchain-app/src/utils/encryption.ts
import bs58 from 'bs58';

async function deriveKey(password: string, salt: Uint8Array) {
  const pwUtf8 = new TextEncoder().encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    'raw', pwUtf8, { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSecret(secret: Uint8Array, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(password, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    secret
  );
  // payload: salt | iv | ciphertext
  const payload = new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(encrypted),
  ]);
  return bs58.encode(payload);
}

export async function decryptSecret(encryptedPayload: string, password: string): Promise<Uint8Array> {
  const data = bs58.decode(encryptedPayload);
  const salt = data.slice(0, 16);
  const iv   = data.slice(16, 28);
  const ciphertext = data.slice(28);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new Uint8Array(decrypted);
}