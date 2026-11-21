import { connectToDatabase } from '../../lib/mongodb.js';
import MLPrediction from '../../models/MLPrediction.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      history: [
        {
          id: 'PRED-1',
          deviceId,
          irrigationRequired: true,
          recommendation: 'Soil moisture is below configured threshold',
          confidence: 0.94,
          modelVersion: '1.0',
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  try {
    const history = await MLPrediction.find({ deviceId })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
