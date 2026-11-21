// Verification test script for KrishiPulse Serverless API Handlers
import healthHandler from './api/health.js';
import dashboardHandler from './api/dashboard.js';
import pumpHandler from './api/pump/index.js';
import commandHandler from './api/command.js';
import pumpAckHandler from './api/pump-ack.js';
import analyticsHandler from './api/analytics.js';
import mlPredictHandler from './api/ml/predict.js';

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

async function runTests() {
  console.log('🧪 Starting KrishiPulse Serverless API verification suite...\n');

  // Test 1: GET /api/health
  {
    const req = { method: 'GET', headers: {} };
    const res = mockRes();
    await healthHandler(req, res);
    console.log('1. GET /api/health -> Status:', res.statusCode, 'Service:', res.body?.service, 'Status:', res.body?.status);
    if (res.statusCode !== 200 || !res.body?.success) throw new Error('Health check failed');
  }

  // Test 2: GET /api/dashboard
  {
    const req = { method: 'GET', query: { deviceId: 'KP001' }, headers: {} };
    const res = mockRes();
    await dashboardHandler(req, res);
    console.log('2. GET /api/dashboard -> Status:', res.statusCode, 'Moisture:', res.body?.dashboard?.soilMoisture, 'Pump:', res.body?.dashboard?.pumpStatus);
    if (res.statusCode !== 200 || !res.body?.success) throw new Error('Dashboard API failed');
  }

  // Test 3: POST /api/pump
  {
    const req = {
      method: 'POST',
      body: { deviceId: 'KP001', command: 'PUMP_ON', mode: 'MANUAL' },
      headers: {},
    };
    const res = mockRes();
    await pumpHandler(req, res);
    console.log('3. POST /api/pump -> Status:', res.statusCode, 'Command:', res.body?.command?.command, 'Status:', res.body?.command?.status);
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error('Pump command API failed');
  }

  // Test 4: GET /api/command (ESP32 Polling)
  {
    const req = { method: 'GET', query: { deviceId: 'KP001' }, headers: { authorization: 'Bearer simulated_esp32_secret' } };
    const res = mockRes();
    await commandHandler(req, res);
    console.log('4. GET /api/command -> Status:', res.statusCode, 'Command polled:', res.body?.command);
    if (res.statusCode !== 200) throw new Error('Command polling API failed');
  }

  // Test 5: POST /api/pump-ack (ESP32 Handshake)
  {
    const req = {
      method: 'POST',
      body: { deviceId: 'KP001', commandId: 'CMD_MOCK_1', status: 'EXECUTED', pumpStatus: 'ON' },
      headers: { authorization: 'Bearer simulated_esp32_secret' },
    };
    const res = mockRes();
    await pumpAckHandler(req, res);
    console.log('5. POST /api/pump-ack -> Status:', res.statusCode, 'Acknowledged:', res.body?.message);
    if (res.statusCode !== 200) throw new Error('Pump acknowledgement failed');
  }

  // Test 6: GET /api/analytics
  {
    const req = { method: 'GET', query: { deviceId: 'KP001', range: '7d' }, headers: {} };
    const res = mockRes();
    await analyticsHandler(req, res);
    console.log('6. GET /api/analytics -> Status:', res.statusCode, 'Avg Moisture:', res.body?.analytics?.averageSoilMoisture);
    if (res.statusCode !== 200 || !res.body?.success) throw new Error('Analytics API failed');
  }

  // Test 7: POST /api/ml/predict
  {
    const req = {
      method: 'POST',
      body: { deviceId: 'KP001', soilMoisture: 26.5, temperature: 34.0, humidity: 45.0 },
      headers: {},
    };
    const res = mockRes();
    await mlPredictHandler(req, res);
    console.log('7. POST /api/ml/predict -> Status:', res.statusCode, 'Irrigate:', res.body?.prediction?.irrigationRequired, 'Confidence:', res.body?.prediction?.confidence);
    if (res.statusCode !== 200 || !res.body?.success) throw new Error('ML Predict API failed');
  }

  console.log('\n🎉 ALL 7 SERVERLESS API SUITES PASSED FLAWLESSLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
