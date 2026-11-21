import { connectToDatabase } from '../../lib/mongodb.js';
import { validatePumpCommand } from '../../lib/validation.js';
import PumpCommand from '../../models/PumpCommand.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const validation = validatePumpCommand(req.body);
  if (!validation.isValid) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  const { deviceId, command, mode = 'MANUAL', reason } = req.body;
  const dbStatus = await connectToDatabase();

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minute expiry

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      message: 'Pump command created (Simulated mode)',
      command: {
        commandId: 'CMD_' + Date.now(),
        deviceId,
        command,
        operatingMode: mode,
        status: 'PENDING',
        expiresAt: expiresAt.toISOString(),
      },
    });
  }

  try {
    const pumpCommand = await PumpCommand.create({
      deviceId,
      command,
      operatingMode: mode,
      commandStatus: 'PENDING',
      reason: reason || 'Farmer requested pump operation',
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      message: 'Pump command created',
      command: {
        commandId: pumpCommand._id,
        command: pumpCommand.command,
        operatingMode: pumpCommand.operatingMode,
        status: pumpCommand.commandStatus,
        expiresAt: pumpCommand.expiresAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
