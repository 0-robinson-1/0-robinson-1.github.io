import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
// Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://0-robinson-1.github.io'); // Specific to your GH Pages origin; or use '*' for any origin (less secure)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request (browser sends this before POST)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('list-wallets function called'); // debugging
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const kv = createClient({
      url: process.env.KV_URL,
      token: process.env.KV_TOKEN,
    });
    const keys = await kv.keys('wallet:*');
    const walletIds = keys.map(key => key.replace('wallet:', ''));
    return res.status(200).json(walletIds);
  } catch (error: any) {
    return res.status(500).json({ error: `Failed to list wallets: ${error.message}` });
  }
}