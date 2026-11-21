import { connectToDatabase } from '../../lib/mongodb.js';
import IrrigationHistory from '../../models/IrrigationHistory.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001', range = '7d' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      history: [
        {
          id: 'IRR-101',
          deviceId,
          operatingMode: 'AUTO',
          startTime: new Date(Date.now() - 3600000 * 8).toISOString(),
          endTime: new Date(Date.now() - 3600000 * 8 + 180000).toISOString(),
          durationSeconds: 180,
          status: 'COMPLETED',
          stopReason: 'Target moisture reached (42%)',
        },
        {
          id: 'IRR-100',
          deviceId,
          operatingMode: 'MANUAL',
          startTime: new Date(Date.now() - 3600000 * 24).toISOString(),
          endTime: new Date(Date.now() - 3600000 * 24 + 300000).toISOString(),
          durationSeconds: 300,
          status: 'COMPLETED',
          stopReason: 'Manual user stop',
        },
      ],
    });
  }

  try {
    const history = await IrrigationHistory.find({ deviceId })
      .sort({ startTime: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      history: history.map((item) => ({
        id: item._id,
        deviceId: item.deviceId,
        operatingMode: item.operatingMode,
        startTime: item.startTime,
        endTime: item.endTime,
        durationSeconds: item.durationSeconds,
        status: item.status,
        stopReason: item.stopReason,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
