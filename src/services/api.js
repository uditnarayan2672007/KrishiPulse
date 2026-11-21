// Unified API Client for KrishiPulse
// Communicates with backend /api endpoints with seamless fallback to simulated data
// when backend database or serverless functions are not yet actively connected.

import {
  getSimulatedReading,
  setSimulatedPumpState,
  generateHistoryData,
  calculateMLRecommendation,
  INITIAL_DEVICES,
  INITIAL_IRRIGATION_LOGS,
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = {
  // Check health of backend
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return await res.json();
      throw new Error('Backend response not OK');
    } catch (err) {
      return {
        success: true,
        service: 'KrishiPulse Frontend (Simulation Mode)',
        status: 'SIMULATED',
        database: 'STANDBY',
        message: 'Running in simulated IoT sensor mode. Ready for MongoDB Atlas & Vercel deployment.',
      };
    }
  },

  // Devices
  async getDevices() {
    try {
      const res = await fetch(`${BASE_URL}/device`);
      if (res.ok) {
        const data = await res.json();
        if (data.devices && data.devices.length > 0) return data.devices;
      }
    } catch (e) {
      // Fallback
    }
    const saved = localStorage.getItem('krishipulse_custom_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  },

  async registerDevice(deviceData) {
    try {
      const res = await fetch(`${BASE_URL}/device/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback local save
    }
    const current = await this.getDevices();
    const newDevice = {
      deviceId: deviceData.deviceId || `KP${String(current.length + 1).padStart(3, '0')}`,
      deviceName: deviceData.deviceName || 'New Agricultural Zone',
      connectionStatus: 'ONLINE',
      lastSeen: new Date().toISOString(),
      lastReadingAt: new Date().toISOString(),
      pumpStatus: 'OFF',
      operatingMode: 'MANUAL',
      cropType: deviceData.cropType || 'General Crop',
      zone: deviceData.zone || 'Zone A',
      soilMoistureThreshold: 35,
      maxPumpRuntimeSeconds: 600,
    };
    const updated = [...current, newDevice];
    localStorage.setItem('krishipulse_custom_devices', JSON.stringify(updated));
    return {
      success: true,
      message: 'Device registered successfully (Simulated)',
      device: newDevice,
      deviceToken: 'kp_dev_tok_' + Math.random().toString(36).substring(2, 15),
    };
  },

  // Dashboard API
  async getDashboard(deviceId = 'KP001') {
    try {
      const res = await fetch(`${BASE_URL}/dashboard?deviceId=${deviceId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    const reading = getSimulatedReading(deviceId);
    const recommendation = calculateMLRecommendation(
      reading.soilMoisture,
      reading.temperature,
      reading.humidity
    );

    return {
      success: true,
      dashboard: {
        deviceId,
        soilMoisture: reading.soilMoisture,
        temperature: reading.temperature,
        humidity: reading.humidity,
        waterAvailable: reading.waterAvailable,
        pumpStatus: reading.pumpStatus,
        operatingMode: reading.operatingMode,
        connectionStatus: 'ONLINE',
        lastUpdated: reading.recordedAt,
      },
      recommendation,
      isSimulated: true,
    };
  },

  // Pump Control
  async sendPumpCommand(deviceId, command, mode = 'MANUAL') {
    try {
      const res = await fetch(`${BASE_URL}/pump`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, command, mode }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    // Update simulated state
    const state = setSimulatedPumpState(deviceId, command === 'PUMP_ON' ? 'ON' : 'OFF', mode);
    return {
      success: true,
      message: `Pump command ${command} accepted and acknowledged`,
      command: {
        commandId: 'CMD_' + Date.now().toString(36).toUpperCase(),
        command,
        operatingMode: mode,
        status: 'EXECUTED',
        acknowledgedAt: new Date().toISOString(),
      },
      pumpStatus: state.pumpStatus,
    };
  },

  // Sensor History
  async getSensorHistory(deviceId = 'KP001', range = '24h') {
    try {
      const res = await fetch(`${BASE_URL}/sensor/history?deviceId=${deviceId}&range=${range}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history) return data.history;
      }
    } catch (e) {
      // Fallback
    }
    return generateHistoryData(deviceId, range);
  },

  // Irrigation History
  async getIrrigationHistory(deviceId = 'KP001') {
    try {
      const res = await fetch(`${BASE_URL}/irrigation/history?deviceId=${deviceId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history) return data.history;
      }
    } catch (e) {
      // Fallback
    }
    const saved = localStorage.getItem('krishipulse_irrigation_logs');
    return saved ? JSON.parse(saved) : INITIAL_IRRIGATION_LOGS;
  },

  // ML Predict
  async getMLPrediction(payload) {
    try {
      const res = await fetch(`${BASE_URL}/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    const prediction = calculateMLRecommendation(
      payload.soilMoisture,
      payload.temperature,
      payload.humidity
    );
    return {
      success: true,
      prediction,
      isSimulated: true,
    };
  },

  // Analytics summary
  async getAnalytics(deviceId = 'KP001', range = '7d') {
    try {
      const res = await fetch(`${BASE_URL}/analytics?deviceId=${deviceId}&range=${range}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return {
      success: true,
      analytics: {
        averageSoilMoisture: 38.6,
        averageTemperature: 27.8,
        averageHumidity: 63.4,
        totalIrrigationEvents: 14,
        totalPumpRuntimeMinutes: 52,
        estimatedWaterSavedLiters: 1450,
        irrigationEfficiencyScore: 92,
      },
      isSimulated: true,
    };
  },
};
