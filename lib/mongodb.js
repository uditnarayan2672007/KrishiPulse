import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless execution invocations on Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    return {
      connected: false,
      reason: 'MONGODB_URI is not configured in environment variables.',
    };
  }

  if (cached.conn) {
    return { connected: true, connection: cached.conn };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { connected: true, connection: cached.conn };
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Atlas connection error:', e.message);
    return { connected: false, error: e.message };
  }
}
