import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, data } = req.body;
  if (!id || !data) {
    return res.status(400).json({ error: 'Missing id or data' });
  }

  try {
    const kv = createClient({
      url: process.env.KV_URL,
      token: process.env.KV_TOKEN,
    });
    await kv.set(`wallet:${id}`, JSON.stringify(data));
    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: `Failed to save wallet: ${error.message}` });
  }
}