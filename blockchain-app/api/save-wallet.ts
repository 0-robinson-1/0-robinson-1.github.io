import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://0-robinson-1.github.io'); // Specific to GH Pages origin; or use '*' for any origin (less secure)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request (browser sends this before POST)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('save-wallet function called with body:', req.body); // debugging

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, data } = req.body;
  if (!id || !data) {
    return res.status(400).json({ error: 'Missing id or data' });
  }

  try {
    const kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    await kv.set(`wallet:${id}`, JSON.stringify(data));
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error in save-wallet:', error);  // Error logging
    return res.status(500).json({ error: `Failed to save wallet: ${error.message}` });
  }
}