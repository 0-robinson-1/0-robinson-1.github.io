import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://0-robinson-1.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use req.query.id for the dynamic path
  const { id } = req.query as { id: string };
  console.log('get-wallet function called with id:', id);

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
    // Return the data directly (it's already an object)
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in get-wallet:', error);
    return res.status(500).json({ error: `Failed to get wallet: ${error.message}` });
  }
}