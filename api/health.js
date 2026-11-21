import { connectToDatabase } from '../lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const dbStatus = await connectToDatabase();

  return res.status(200).json({
    success: true,
    service: 'KrishiPulse API',
    status: 'HEALTHY',
    database: dbStatus.connected ? 'CONNECTED' : 'STANDBY',
    timestamp: new Date().toISOString(),
  });
}
