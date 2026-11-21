/**
 * Validation rules per Section 11 of DatabaseSchema.md.txt
 */

export function validateSensorReading(body) {
  const errors = [];

  if (!body.deviceId || typeof body.deviceId !== 'string') {
    errors.push('deviceId is required and must be a string');
  }

  const moisture = Number(body.soilMoisture);
  if (isNaN(moisture) || moisture < 0 || moisture > 100) {
    errors.push('soilMoisture must be a calibrated number between 0 and 100');
  }

  const temp = Number(body.temperature);
  if (isNaN(temp) || temp < -20 || temp > 70) {
    errors.push('temperature must be a valid number within physical sensor limits (-20°C to 70°C)');
  }

  const humidity = Number(body.humidity);
  if (isNaN(humidity) || humidity < 0 || humidity > 100) {
    errors.push('humidity must be a number between 0 and 100%');
  }

  if (body.waterAvailable !== undefined && typeof body.waterAvailable !== 'boolean') {
    errors.push('waterAvailable must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePumpCommand(body) {
  const errors = [];

  if (!body.deviceId || typeof body.deviceId !== 'string') {
    errors.push('deviceId is required');
  }

  if (!body.command || !['PUMP_ON', 'PUMP_OFF'].includes(body.command)) {
    errors.push('command must be either PUMP_ON or PUMP_OFF');
  }

  if (body.mode && !['MANUAL', 'AUTO'].includes(body.mode)) {
    errors.push('mode must be either MANUAL or AUTO');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
