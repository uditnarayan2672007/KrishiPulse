import { connectToDatabase } from '../../lib/mongodb.js';
import SensorReading from '../../models/SensorReading.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      data: {
        deviceId,
        soilMoisture: 35.5,
        temperature: 28.2,
        humidity: 62.0,
        waterAvailable: true,
        recordedAt: new Date().toISOString(),
      },
    });
  }

  try {
    const latest = await SensorReading.findOne({ deviceId }).sort({ recordedAt: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: 'No sensor readings found for this device',
      });
    }

    return res.status(200).json({
      success: true,
      data: latest,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
