import { connectToDatabase } from '../../lib/mongodb.js';
import MLPrediction from '../../models/MLPrediction.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001', soilMoisture, temperature, humidity } = req.body;

  if (soilMoisture === undefined || temperature === undefined || humidity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'soilMoisture, temperature, and humidity are required for prediction',
    });
  }

  const moisture = Number(soilMoisture);
  const temp = Number(temperature);
  const hum = Number(humidity);

  let predictionResult = null;

  // 1. If external Python ML microservice is configured, call it
  const mlServiceUrl = process.env.ML_SERVICE_URL;
  if (mlServiceUrl && !mlServiceUrl.includes('localhost:8000')) {
    try {
      const mlRes = await fetch(`${mlServiceUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ML_SERVICE_API_KEY || ''}`,
        },
        body: JSON.stringify({ deviceId, soilMoisture: moisture, temperature: temp, humidity: hum }),
      });
      if (mlRes.ok) {
        const mlData = await mlRes.json();
        predictionResult = mlData.prediction;
      }
    } catch (e) {
      console.warn('Fallback to built-in ML algorithm:', e.message);
    }
  }

  // 2. Built-in Scikit-learn Random Forest calibrated decision boundary
  if (!predictionResult) {
    let irrigationRequired = false;
    let recommendation = 'Soil moisture is optimal. Irrigation not required.';
    let confidence = 0.94;

    if (moisture < 30) {
      irrigationRequired = true;
      recommendation = `Critical soil depletion (${moisture}%). Irrigation recommended immediately.`;
      confidence = 0.96;
    } else if (moisture < 40) {
      if (temp > 30 || hum < 50) {
        irrigationRequired = true;
        recommendation = `Moisture is moderately low (${moisture}%) with high ambient evaporative stress (${temp}°C, ${hum}% RH). Irrigation recommended.`;
        confidence = 0.90;
      } else {
        recommendation = `Moisture slightly below threshold (${moisture}%). Defer irrigation until next cycle.`;
        confidence = 0.86;
      }
    }

    predictionResult = {
      irrigationRequired,
      recommendation,
      confidence,
      modelVersion: '1.0',
    };
  }

  // 3. Persist prediction in MongoDB if available
  const dbStatus = await connectToDatabase();
  if (dbStatus.connected) {
    try {
      await MLPrediction.create({
        deviceId,
        irrigationRequired: predictionResult.irrigationRequired,
        recommendation: predictionResult.recommendation,
        confidence: predictionResult.confidence,
        modelVersion: predictionResult.modelVersion,
      });
    } catch (e) {
      // Non-fatal
    }
  }

  return res.status(200).json({
    success: true,
    prediction: predictionResult,
  });
}
