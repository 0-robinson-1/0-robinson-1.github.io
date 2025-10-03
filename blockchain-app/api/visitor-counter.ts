import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Increment the count
      await sql`UPDATE visitor_counter SET count = count + 1 WHERE id = 1;`;
      return res.status(200).json({ success: true });
    } else if (req.method === 'GET') {
      // Fetch the current count
      const { rows } = await sql`SELECT count FROM visitor_counter WHERE id = 1;`;
      const currentCount = rows[0]?.count || 592;  // Fallback if no row
      return res.status(200).json({ count: currentCount });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}