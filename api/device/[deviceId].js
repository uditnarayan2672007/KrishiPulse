import { connectToDatabase } from '../../lib/mongodb.js';
import Device from '../../models/Device.js';

export default async function handler(req, res) {
  const { deviceId } = req.query;
  const dbStatus = await connectToDatabase();

  if (req.method === 'GET') {
    if (!dbStatus.connected) {
      return res.status(200).json({
        success: true,
        device: {
          deviceId: deviceId || 'KP001',
          deviceName: 'Farm Sensor Node 01',
          connectionStatus: 'ONLINE',
          lastSeen: new Date().toISOString(),
          pumpStatus: 'OFF',
          operatingMode: 'AUTO',
        },
      });
    }

    try {
      const device = await Device.findOne({ deviceId }, '-deviceTokenHash');
      if (!device) {
        return res.status(404).json({ success: false, message: 'Device not found' });
      }
      return res.status(200).json({ success: true, device });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!dbStatus.connected) {
      return res.status(200).json({
        success: true,
        message: 'Device removed successfully (Simulated mode)',
      });
    }

    try {
      const result = await Device.findOneAndDelete({ deviceId });
      if (!result) {
        return res.status(404).json({ success: false, message: 'Device not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Device removed successfully',
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
