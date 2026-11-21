import mongoose from 'mongoose';

const PumpCommandSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    command: {
      type: String,
      enum: ['PUMP_ON', 'PUMP_OFF'],
      required: true,
    },
    operatingMode: {
      type: String,
      enum: ['MANUAL', 'AUTO'],
      default: 'MANUAL',
    },
    commandStatus: {
      type: String,
      enum: ['PENDING', 'CLAIMED', 'EXECUTED', 'FAILED', 'EXPIRED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    reason: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    collection: 'pump_commands',
  }
);

// Compound index per DatabaseSchema.md.txt
PumpCommandSchema.index({ deviceId: 1, commandStatus: 1, createdAt: 1 });

export default mongoose.models.PumpCommand ||
  mongoose.model('PumpCommand', PumpCommandSchema);
