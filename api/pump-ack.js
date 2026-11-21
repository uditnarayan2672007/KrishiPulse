import { connectToDatabase } from '../lib/mongodb.js';
import { authenticateDevice } from '../lib/device-auth.js';
import PumpCommand from '../models/PumpCommand.js';
import Device from '../models/Device.js';
import IrrigationHistory from '../models/IrrigationHistory.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { deviceId, commandId, status, pumpStatus, reason } = req.body;

  if (!deviceId || !commandId || !status) {
    return res.status(400).json({
      success: false,
      message: 'deviceId, commandId, and status are required',
    });
  }

  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      message: 'Command acknowledgement received (Simulated mode)',
      acknowledgedAt: new Date().toISOString(),
    });
  }

  try {
    const now = new Date();

    // 1. Update command status
    const command = await PumpCommand.findByIdAndUpdate(
      commandId,
      {
        commandStatus: status,
        acknowledgedAt: now,
        failureReason: reason || null,
      },
      { new: true }
    );

    // 2. Update Device confirmed pump state
    if (pumpStatus) {
      await Device.findOneAndUpdate(
        { deviceId },
        {
          pumpStatus,
          lastSeen: now,
        }
      );
    }

    // 3. Manage IrrigationHistory lifecycle
    if (status === 'EXECUTED') {
      if (pumpStatus === 'ON') {
        // Open new irrigation history event
        await IrrigationHistory.create({
          deviceId,
          startCommandId: commandId,
          operatingMode: command?.operatingMode || 'MANUAL',
          startTime: now,
          status: 'RUNNING',
        });
      } else if (pumpStatus === 'OFF') {
        // Find and close open running irrigation event
        const openEvent = await IrrigationHistory.findOne({
          deviceId,
          status: 'RUNNING',
        }).sort({ startTime: -1 });

        if (openEvent) {
          const duration = Math.round((now.getTime() - openEvent.startTime.getTime()) / 1000);
          openEvent.endTime = now;
          openEvent.durationSeconds = duration;
          openEvent.status = 'COMPLETED';
          openEvent.stopCommandId = commandId;
          openEvent.stopReason = reason || 'Pump turned OFF';
          await openEvent.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Command acknowledgement received',
      commandStatus: status,
      pumpStatus: pumpStatus || 'UNCHANGED',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
