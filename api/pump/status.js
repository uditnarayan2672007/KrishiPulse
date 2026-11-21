import { connectToDatabase } from '../../lib/mongodb.js';
import Device from '../../models/Device.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      pumpStatus: 'OFF',
      operatingMode: 'MANUAL',
      lastAcknowledgedAt: new Date().toISOString(),
    });
  }

  try {
    const device = await Device.findOne({ deviceId });
    return res.status(200).json({
      success: true,
      pumpStatus: device ? device.pumpStatus : 'UNKNOWN',
      operatingMode: device ? device.operatingMode : 'MANUAL',
      lastAcknowledgedAt: device?.updatedAt || new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
