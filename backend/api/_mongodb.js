import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function getClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDb(dbName = process.env.MONGODB_DB || 'worksheet') {
  const client = await getClient();
  return client.db(dbName);
}
