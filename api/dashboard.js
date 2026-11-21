import { connectToDatabase } from '../lib/mongodb.js';
import SensorReading from '../models/SensorReading.js';
import Device from '../models/Device.js';
import MLPrediction from '../models/MLPrediction.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    // Return high-fidelity simulated response
    return res.status(200).json({
      success: true,
      dashboard: {
        deviceId,
        soilMoisture: 34.5,
        temperature: 28.3,
        humidity: 58.2,
        waterAvailable: true,
        pumpStatus: 'OFF',
        operatingMode: 'AUTO',
        connectionStatus: 'ONLINE',
        lastUpdated: new Date().toISOString(),
      },
      recommendation: {
        irrigationRequired: true,
        urgency: 'MODERATE',
        recommendation: 'Soil moisture is slightly below optimum threshold. Irrigation advised.',
        confidence: 0.93,
        modelVersion: 'v1.1-randomforest',
      },
      isSimulated: true,
    });
  }

  try {
    const [latestReading, device, latestPrediction] = await Promise.all([
      SensorReading.findOne({ deviceId }).sort({ recordedAt: -1 }),
      Device.findOne({ deviceId }),
      MLPrediction.findOne({ deviceId }).sort({ createdAt: -1 }),
    ]);

    const dashboard = {
      deviceId,
      soilMoisture: latestReading ? latestReading.soilMoisture : 35,
      temperature: latestReading ? latestReading.temperature : 28,
      humidity: latestReading ? latestReading.humidity : 60,
      waterAvailable: latestReading ? latestReading.waterAvailable : true,
      pumpStatus: device ? device.pumpStatus : 'OFF',
      operatingMode: device ? device.operatingMode : 'AUTO',
      connectionStatus: device ? device.connectionStatus : 'OFFLINE',
      lastUpdated: latestReading ? latestReading.recordedAt : new Date().toISOString(),
    };

    const recommendation = latestPrediction || {
      irrigationRequired: dashboard.soilMoisture < 35,
      recommendation:
        dashboard.soilMoisture < 35
          ? 'Soil moisture is below configured threshold'
          : 'Moisture level is adequate',
      confidence: 0.9,
      modelVersion: '1.0',
    };

    return res.status(200).json({
      success: true,
      dashboard,
      recommendation,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
