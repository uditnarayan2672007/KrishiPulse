import { connectToDatabase } from '../../lib/mongodb.js';
import SensorReading from '../../models/SensorReading.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001', range = '24h' } = req.query;
  const dbStatus = await connectToDatabase();

  const now = new Date();
  let timeFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (range === '1h') timeFrom = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  if (range === '7d') timeFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30d') timeFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (!dbStatus.connected) {
    // Generate simulated range points
    const points = range === '1h' ? 12 : range === '24h' ? 24 : 30;
    const interval = (now.getTime() - timeFrom.getTime()) / points;
    const history = [];

    for (let i = 0; i < points; i++) {
      const t = new Date(timeFrom.getTime() + i * interval);
      history.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: t.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        timestamp: t.toISOString(),
        soilMoisture: +(34 + Math.sin(i / 2) * 6 + (Math.random() - 0.5) * 2).toFixed(1),
        temperature: +(27 + Math.cos(i / 3) * 4).toFixed(1),
        humidity: +(60 - Math.sin(i / 2) * 8).toFixed(1),
        waterAvailable: true,
      });
    }

    return res.status(200).json({ success: true, history });
  }

  try {
    const readings = await SensorReading.find({
      deviceId,
      recordedAt: { $gte: timeFrom },
    })
      .sort({ recordedAt: 1 })
      .limit(200);

    const history = readings.map((r) => ({
      time: new Date(r.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(r.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      timestamp: r.recordedAt,
      soilMoisture: r.soilMoisture,
      temperature: r.temperature,
      humidity: r.humidity,
      waterAvailable: r.waterAvailable,
    }));

    return res.status(200).json({ success: true, history });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
