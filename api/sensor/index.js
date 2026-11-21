import { connectToDatabase } from '../../lib/mongodb.js';
import { authenticateDevice } from '../../lib/device-auth.js';
import { validateSensorReading } from '../../lib/validation.js';
import SensorReading from '../../models/SensorReading.js';
import Device from '../../models/Device.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 1. Device authentication
  const auth = await authenticateDevice(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      success: false,
      message: auth.error || 'Unauthorized device access',
    });
  }

  // 2. Data validation
  const validation = validateSensorReading(req.body);
  if (!validation.isValid) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  const { deviceId, soilMoisture, temperature, humidity, waterAvailable, recordedAt } = req.body;
  const dbStatus = await connectToDatabase();

  const recordTime = recordedAt ? new Date(recordedAt) : new Date();

  if (!dbStatus.connected) {
    return res.status(201).json({
      success: true,
      message: 'Sensor data received successfully (Simulated mode)',
      readingId: 'sim_read_' + Date.now(),
      recordedAt: recordTime.toISOString(),
    });
  }

  try {
    // 3. Store reading in MongoDB
    const reading = await SensorReading.create({
      deviceId,
      soilMoisture: Number(soilMoisture),
      temperature: Number(temperature),
      humidity: Number(humidity),
      waterAvailable: waterAvailable !== false,
      recordedAt: recordTime,
      receivedAt: new Date(),
    });

    // 4. Update Device telemetry heartbeat
    await Device.findOneAndUpdate(
      { deviceId },
      {
        lastSeen: new Date(),
        lastReadingAt: recordTime,
        connectionStatus: 'ONLINE',
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Sensor data received successfully',
      readingId: reading._id,
      recordedAt: reading.recordedAt,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record sensor reading',
      error: err.message,
    });
  }
}
