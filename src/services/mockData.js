// Realistic Agricultural Simulated Data Engine for KrishiPulse
// Supports live sensor fluctuations, command state machines, and historical timeseries

export const INITIAL_DEVICES = [
  {
    deviceId: 'KP001',
    deviceName: 'North Sector Wheat Field',
    connectionStatus: 'ONLINE',
    lastSeen: new Date().toISOString(),
    lastReadingAt: new Date().toISOString(),
    pumpStatus: 'OFF',
    operatingMode: 'AUTO',
    cropType: 'Wheat',
    zone: 'Sector 4A',
    soilMoistureThreshold: 35,
    maxPumpRuntimeSeconds: 600,
  },
  {
    deviceId: 'KP002',
    deviceName: 'Greenhouse 2 - Drip System',
    connectionStatus: 'ONLINE',
    lastSeen: new Date().toISOString(),
    lastReadingAt: new Date().toISOString(),
    pumpStatus: 'OFF',
    operatingMode: 'MANUAL',
    cropType: 'Tomato',
    zone: 'Greenhouse B',
    soilMoistureThreshold: 45,
    maxPumpRuntimeSeconds: 300,
  },
  {
    deviceId: 'KP003',
    deviceName: 'South Orchard Solar Pump',
    connectionStatus: 'OFFLINE',
    lastSeen: new Date(Date.now() - 3600000 * 4).toISOString(),
    lastReadingAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    pumpStatus: 'OFF',
    operatingMode: 'MANUAL',
    cropType: 'Citrus',
    zone: 'Sector 1C',
    soilMoistureThreshold: 30,
    maxPumpRuntimeSeconds: 900,
  },
];

// In-memory state for dynamic simulation
let simulatedSensorStates = {
  KP001: {
    soilMoisture: 34.2,
    temperature: 28.5,
    humidity: 58.0,
    waterAvailable: true,
    pumpStatus: 'OFF',
    operatingMode: 'AUTO',
    pumpStartTime: null,
  },
  KP002: {
    soilMoisture: 48.0,
    temperature: 26.2,
    humidity: 72.0,
    waterAvailable: true,
    pumpStatus: 'OFF',
    operatingMode: 'MANUAL',
    pumpStartTime: null,
  },
  KP003: {
    soilMoisture: 22.0,
    temperature: 33.1,
    humidity: 42.0,
    waterAvailable: false,
    pumpStatus: 'OFF',
    operatingMode: 'MANUAL',
    pumpStartTime: null,
  },
};

export const getSimulatedReading = (deviceId = 'KP001') => {
  const state = simulatedSensorStates[deviceId] || {
    soilMoisture: 35,
    temperature: 28,
    humidity: 60,
    waterAvailable: true,
    pumpStatus: 'OFF',
    operatingMode: 'AUTO',
  };

  // If pump is ON, moisture gradually climbs; if OFF, gradually dries
  if (state.pumpStatus === 'ON') {
    state.soilMoisture = Math.min(85, +(state.soilMoisture + 0.8 + (Math.random() * 0.4)).toFixed(1));
    // Check runtime cutoff (e.g. 10 mins in simulation)
    if (state.pumpStartTime && (Date.now() - state.pumpStartTime > 600000)) {
      state.pumpStatus = 'OFF';
      state.pumpStartTime = null;
    }
  } else {
    // Natural slight evaporation
    const delta = (Math.random() - 0.52) * 0.3;
    state.soilMoisture = Math.max(10, Math.min(100, +(state.soilMoisture + delta).toFixed(1)));
  }

  // Natural temp/humidity fluctuations
  state.temperature = +(state.temperature + (Math.random() - 0.5) * 0.2).toFixed(1);
  state.humidity = Math.max(20, Math.min(95, +(state.humidity + (Math.random() - 0.5) * 0.4).toFixed(1)));

  return {
    deviceId,
    soilMoisture: state.soilMoisture,
    temperature: state.temperature,
    humidity: state.humidity,
    waterAvailable: state.waterAvailable,
    pumpStatus: state.pumpStatus,
    operatingMode: state.operatingMode,
    recordedAt: new Date().toISOString(),
    isSimulated: true,
  };
};

export const setSimulatedPumpState = (deviceId, newStatus, mode) => {
  if (!simulatedSensorStates[deviceId]) {
    simulatedSensorStates[deviceId] = {
      soilMoisture: 35,
      temperature: 28,
      humidity: 60,
      waterAvailable: true,
      pumpStatus: 'OFF',
      operatingMode: 'MANUAL',
      pumpStartTime: null,
    };
  }
  const state = simulatedSensorStates[deviceId];
  state.pumpStatus = newStatus;
  if (mode) state.operatingMode = mode;
  if (newStatus === 'ON') {
    state.pumpStartTime = Date.now();
  } else {
    state.pumpStartTime = null;
  }
  return state;
};

// Generate historical readings for charts
export const generateHistoryData = (deviceId = 'KP001', range = '24h') => {
  const points = range === '1h' ? 12 : range === '24h' ? 24 : range === '7d' ? 28 : 30;
  const intervalMs =
    range === '1h'
      ? 5 * 60 * 1000
      : range === '24h'
      ? 60 * 60 * 1000
      : range === '7d'
      ? 6 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

  const now = Date.now();
  const data = [];
  let baseMoisture = 38;
  let baseTemp = 27;
  let baseHum = 62;

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMs);
    // Add circadian variation
    const hour = timestamp.getHours();
    const tempModifier = Math.sin(((hour - 8) / 24) * 2 * Math.PI) * 4;
    const humModifier = -tempModifier * 2;
    const moistureNoise = (Math.sin(i / 3) * 5) + (Math.random() - 0.5) * 2;

    const moisture = Math.max(15, Math.min(85, +(baseMoisture + moistureNoise).toFixed(1)));
    const temp = +(baseTemp + tempModifier + (Math.random() - 0.5)).toFixed(1);
    const humidity = Math.max(30, Math.min(95, +(baseHum + humModifier + (Math.random() - 0.5)).toFixed(1)));

    data.push({
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      timestamp: timestamp.toISOString(),
      soilMoisture: moisture,
      temperature: temp,
      humidity: humidity,
      waterAvailable: true,
      pumpActive: moisture < 32,
    });
  }

  return data;
};

// ML Recommendation calculation (rule-based + heuristic model)
export const calculateMLRecommendation = (soilMoisture, temperature, humidity) => {
  let irrigationRequired = false;
  let urgency = 'OPTIMAL';
  let recommendation = 'Soil moisture is in the optimal range for healthy crop root growth.';
  let confidence = 0.94;
  let waterNeedLiters = 0;

  if (soilMoisture < 30) {
    irrigationRequired = true;
    urgency = 'HIGH';
    recommendation = `Critical soil depletion detected (${soilMoisture}%). Immediate irrigation required to prevent crop wilting.`;
    confidence = 0.96;
    waterNeedLiters = 1250;
  } else if (soilMoisture < 40) {
    if (temperature > 30 || humidity < 50) {
      irrigationRequired = true;
      urgency = 'MODERATE';
      recommendation = `Moisture is moderately low (${soilMoisture}%) with high evaporative stress (${temperature}°C, ${humidity}% RH). Irrigation recommended during cooler evening hours.`;
      confidence = 0.89;
      waterNeedLiters = 750;
    } else {
      urgency = 'MONITOR';
      recommendation = `Moisture is slightly below baseline (${soilMoisture}%). Monitor over the next 4 hours; irrigation may be deferred.`;
      confidence = 0.85;
      waterNeedLiters = 200;
    }
  } else if (soilMoisture > 70) {
    urgency = 'SATURATED';
    recommendation = `Soil moisture is high (${soilMoisture}%). Risk of root aeration deficit. Ensure drainage and suspend irrigation.`;
    confidence = 0.92;
  }

  return {
    irrigationRequired,
    urgency,
    recommendation,
    confidence,
    waterNeedLiters,
    modelVersion: 'v1.1-randomforest-calibrated',
    evaluatedAt: new Date().toISOString(),
  };
};

export const INITIAL_IRRIGATION_LOGS = [
  {
    id: 'IRR-1092',
    deviceId: 'KP001',
    operatingMode: 'AUTO',
    startTime: new Date(Date.now() - 3600000 * 14).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 14 + 180000).toISOString(),
    durationSeconds: 180,
    status: 'COMPLETED',
    stopReason: 'Target moisture reached (42%)',
  },
  {
    id: 'IRR-1091',
    deviceId: 'KP001',
    operatingMode: 'MANUAL',
    startTime: new Date(Date.now() - 3600000 * 38).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 38 + 300000).toISOString(),
    durationSeconds: 300,
    status: 'COMPLETED',
    stopReason: 'Manual stop by user',
  },
  {
    id: 'IRR-1090',
    deviceId: 'KP002',
    operatingMode: 'AUTO',
    startTime: new Date(Date.now() - 3600000 * 62).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 62 + 240000).toISOString(),
    durationSeconds: 240,
    status: 'COMPLETED',
    stopReason: 'Scheduled zone cycle complete',
  },
];
