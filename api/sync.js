import { MongoClient } from 'mongodb'

const MONGO_URI = process.env.MONGODB_URI
const client = MONGO_URI ? new MongoClient(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
}) : null

let db

async function getDb() {
  if (!client) throw new Error('MONGODB_URI not set')
  if (!db) { await client.connect(); db = client.db() }
  return db
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const database = await getDb()
    const col = database.collection('prefs')

    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: 'user_prefs' })
      return res.json({ mastered: doc?.mastered ?? [], theme: doc?.theme ?? 'light' })
    }

    if (req.method === 'POST') {
      const { mastered, theme } = req.body
      await col.updateOne(
        { _id: 'user_prefs' },
        { $set: { mastered, theme, updatedAt: new Date() } },
        { upsert: true }
      )
      return res.json({ ok: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('API error:', err.message)
    res.status(503).json({ error: 'Service unavailable', detail: err.message })
  }
}
