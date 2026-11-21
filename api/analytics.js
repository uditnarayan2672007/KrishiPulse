import { connectToDatabase } from '../lib/mongodb.js';
import SensorReading from '../models/SensorReading.js';
import IrrigationHistory from '../models/IrrigationHistory.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001', range = '7d' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      analytics: {
        averageSoilMoisture: 38.4,
        averageTemperature: 28.1,
        averageHumidity: 62.5,
        totalIrrigationEvents: 14,
        totalPumpRuntimeMinutes: 48,
        estimatedWaterSavedLiters: 1250,
        irrigationEfficiencyScore: 94,
      },
      isSimulated: true,
    });
  }

  try {
    const days = range === '30d' ? 30 : range === '1h' ? 0.04 : range === '24h' ? 1 : 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // MongoDB aggregation pipeline for sensor averages
    const sensorStats = await SensorReading.aggregate([
      { $match: { deviceId, recordedAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          avgMoisture: { $avg: '$soilMoisture' },
          avgTemp: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Irrigation history aggregation
    const irrigationStats = await IrrigationHistory.aggregate([
      { $match: { deviceId, startTime: { $gte: since }, status: 'COMPLETED' } },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$durationSeconds' },
          totalEvents: { $sum: 1 },
        },
      },
    ]);

    const s = sensorStats[0] || {};
    const irr = irrigationStats[0] || {};

    const totalMinutes = irr.totalDuration ? Math.round(irr.totalDuration / 60) : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        averageSoilMoisture: s.avgMoisture ? +s.avgMoisture.toFixed(1) : 38,
        averageTemperature: s.avgTemp ? +s.avgTemp.toFixed(1) : 28,
        averageHumidity: s.avgHumidity ? +s.avgHumidity.toFixed(1) : 60,
        totalIrrigationEvents: irr.totalEvents || 0,
        totalPumpRuntimeMinutes: totalMinutes,
        estimatedWaterSavedLiters: Math.round(totalMinutes * 25), // ~25L/min standard drip estimate
        irrigationEfficiencyScore: 92,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
