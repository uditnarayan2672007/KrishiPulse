import mongoose from 'mongoose';

const IrrigationHistorySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    startCommandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PumpCommand',
      required: false,
    },
    stopCommandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PumpCommand',
      required: false,
    },
    operatingMode: {
      type: String,
      enum: ['MANUAL', 'AUTO'],
      default: 'MANUAL',
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    durationSeconds: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['RUNNING', 'COMPLETED', 'INTERRUPTED'],
      default: 'RUNNING',
    },
    stopReason: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'irrigation_history',
  }
);

// Compound index per DatabaseSchema.md.txt
IrrigationHistorySchema.index({ deviceId: 1, startTime: -1 });

export default mongoose.models.IrrigationHistory ||
  mongoose.model('IrrigationHistory', IrrigationHistorySchema);
