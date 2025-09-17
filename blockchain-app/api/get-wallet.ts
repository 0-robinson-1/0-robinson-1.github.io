import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://0-robinson-1.github.io'); // Github pages Front end origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request (browser sends this before POST)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse id from path
  const urlParts = req.url?.split('/') || [];
  const id = decodeURIComponent(urlParts[urlParts.length - 1]);
  console.log('get-wallet function called with id:', id); // Improved debugging

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  try {
    const kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    const data = await kv.get(`wallet:${id}`);
    if (data === null) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    return res.status(200).json(JSON.parse(data as string)); // Parse the stringified data
  } catch (error: any) {
    console.error('Error in get-wallet:', error);
    return res.status(500).json({ error: `Failed to get wallet: ${error.message}` });
  }
}