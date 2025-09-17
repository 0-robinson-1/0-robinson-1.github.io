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
  console.log('get-wallet function called with query:', req.query); // debugging
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: 'Missing wallet id' });
  }

  try {
    const kv = createClient({
      url: process.env.KV_URL,
      token: process.env.KV_TOKEN,
    });
    const data = await kv.get(`wallet:${id}`);
    if (!data) {
      return res.status(404).json({ error: `Wallet ${id} not found` });
    }
    return res.status(200).json(JSON.parse(data as string));
  } catch (error: any) {
    return res.status(500).json({ error: `Failed to fetch wallet: ${error.message}` });
  }
}