import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for unassigned hardware provisioning
      index: true,
    },
    deviceName: {
      type: String,
      required: true,
      trim: true,
    },
    deviceTokenHash: {
      type: String,
      required: true,
    },
    connectionStatus: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'OFFLINE',
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    lastReadingAt: {
      type: Date,
      default: null,
    },
    pumpStatus: {
      type: String,
      enum: ['ON', 'OFF', 'UNKNOWN'],
      default: 'OFF',
    },
    operatingMode: {
      type: String,
      enum: ['MANUAL', 'AUTO'],
      default: 'AUTO',
    },
    cropType: {
      type: String,
      default: 'General Crop',
    },
    zone: {
      type: String,
      default: 'Zone 1',
    },
    soilMoistureThreshold: {
      type: Number,
      default: 35,
    },
    maxPumpRuntimeSeconds: {
      type: Number,
      default: 600,
    },
  },
  {
    timestamps: true,
    collection: 'devices',
  }
);

export default mongoose.models.Device || mongoose.model('Device', DeviceSchema);
