import { connectToDatabase } from '../../lib/mongodb.js';
import { authenticateUser } from '../../lib/auth.js';
import Device from '../../models/Device.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  const dbStatus = await connectToDatabase();

  if (req.method === 'GET') {
    if (!dbStatus.connected) {
      // Return simulated device list
      return res.status(200).json({
        success: true,
        devices: [
          {
            deviceId: 'KP001',
            deviceName: 'North Sector Wheat Field',
            connectionStatus: 'ONLINE',
            lastSeen: new Date().toISOString(),
            pumpStatus: 'OFF',
            operatingMode: 'AUTO',
          },
          {
            deviceId: 'KP002',
            deviceName: 'Greenhouse 2 - Drip System',
            connectionStatus: 'ONLINE',
            lastSeen: new Date().toISOString(),
            pumpStatus: 'OFF',
            operatingMode: 'MANUAL',
          },
        ],
      });
    }

    try {
      const devices = await Device.find({}, '-deviceTokenHash').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, devices });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method === 'POST') {
    const { deviceId, deviceName, cropType, zone } = req.body || {};

    if (!deviceId || !deviceName) {
      return res.status(400).json({
        success: false,
        message: 'deviceId and deviceName are required',
      });
    }

    const deviceToken = 'kp_tok_' + crypto.randomBytes(16).toString('hex');
    const deviceTokenHash = crypto.createHash('sha256').update(deviceToken).digest('hex');

    if (!dbStatus.connected) {
      return res.status(201).json({
        success: true,
        message: 'Device registered successfully (Simulated mode)',
        device: {
          deviceId,
          deviceName,
          cropType: cropType || 'General Crop',
          zone: zone || 'Zone 1',
          connectionStatus: 'OFFLINE',
        },
        deviceToken,
      });
    }

    try {
      const existing = await Device.findOne({ deviceId });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Device ID already exists' });
      }

      const device = await Device.create({
        deviceId,
        deviceName,
        cropType: cropType || 'General Crop',
        zone: zone || 'Zone 1',
        deviceTokenHash,
        connectionStatus: 'OFFLINE',
      });

      return res.status(201).json({
        success: true,
        message: 'Device registered successfully',
        device: {
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          connectionStatus: device.connectionStatus,
        },
        deviceToken, // Returned only once during provisioning
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
