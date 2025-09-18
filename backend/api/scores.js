import { getDb } from './_mongodb.js';

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const collection = db.collection('scores');

    if (req.method === 'POST') {
      const { name } = req.body || {};
      let { score } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Name required' });
      score = Number(score);
      if (!Number.isFinite(score) || score < 0 || score > 12) {
        return res.status(400).json({ error: 'Score must be a number between 0 and 12' });
      }

      const doc = { name: String(name).trim().slice(0, 100), score, created_at: new Date() };
      await collection.insertOne(doc);
      return res.status(201).json({ message: 'Score added' });
    }

    if (req.method === 'GET') {
      const docs = await collection.find({}).sort({ score: -1, created_at: 1 }).limit(10).toArray();
      return res.status(200).json(docs);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Scores API error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
