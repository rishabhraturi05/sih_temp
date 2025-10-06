import mongoose from 'mongoose';

const { MONGODB_URL, MONGODB_DB } = process.env;

if (!MONGODB_URL) {
  throw new Error('Missing MONGODB_URL in environment');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGODB_URL, { dbName: MONGODB_DB })
        .then((mongooseInstance) => mongooseInstance);
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
