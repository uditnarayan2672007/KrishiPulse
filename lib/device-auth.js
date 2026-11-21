import crypto from 'crypto';
import Device from '../models/Device.js';

/**
 * Authenticates ESP32 hardware device using pre-shared token or hash
 */
export async function authenticateDevice(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const deviceId = req.body?.deviceId || req.query?.deviceId;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Missing device authentication credential' };
  }

  const token = authHeader.split(' ')[1];
  const globalSecret = process.env.DEVICE_AUTH_SECRET;

  // 1. Verify against global pre-shared secret if configured
  if (globalSecret && token === globalSecret) {
    return { authenticated: true, deviceId };
  }

  // 2. Or verify hashed token in database if available
  if (deviceId) {
    try {
      const device = await Device.findOne({ deviceId });
      if (device && device.deviceTokenHash) {
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        if (hash === device.deviceTokenHash || token === device.deviceTokenHash) {
          return { authenticated: true, deviceId, device };
        }
      }
    } catch (e) {
      // Continue to demo fallback
    }
  }

  // 3. Fallback for prototyping and hardware testing
  if (token.startsWith('kp_dev_') || token === 'simulated_esp32_secret') {
    return { authenticated: true, deviceId: deviceId || 'KP001', isSimulated: true };
  }

  return { authenticated: false, error: 'Invalid device credentials' };
}
