import { connectToDatabase } from '../lib/mongodb.js';
import { authenticateDevice } from '../lib/device-auth.js';
import PumpCommand from '../models/PumpCommand.js';

/**
 * ESP32 polls this endpoint periodically (every 2-5s) to retrieve pending commands.
 * Commands are leased/claimed atomically so repeated polling does not trigger duplicate executions.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId = 'KP001' } = req.query;
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    // Return no pending command in standby simulation
    return res.status(200).json({
      success: true,
      command: null,
      message: 'No pending commands (Simulated)',
    });
  }

  try {
    const now = new Date();

    // Expire any outdated pending commands first
    await PumpCommand.updateMany(
      {
        deviceId,
        commandStatus: 'PENDING',
        expiresAt: { $lt: now },
      },
      { commandStatus: 'EXPIRED' }
    );

    // Atomically find and claim the oldest active PENDING command
    const command = await PumpCommand.findOneAndUpdate(
      {
        deviceId,
        commandStatus: 'PENDING',
        expiresAt: { $gte: now },
      },
      {
        commandStatus: 'CLAIMED',
        claimedAt: now,
      },
      { sort: { createdAt: 1 }, new: true }
    );

    if (!command) {
      return res.status(200).json({
        success: true,
        command: null,
      });
    }

    return res.status(200).json({
      success: true,
      command: {
        commandId: command._id,
        command: command.command,
        mode: command.operatingMode,
        expiresAt: command.expiresAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
