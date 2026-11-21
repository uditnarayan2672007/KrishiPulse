import mongoose from 'mongoose';

const SensorReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    waterAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'sensor_readings',
  }
);

// Compound index per DatabaseSchema.md.txt
SensorReadingSchema.index({ deviceId: 1, recordedAt: -1 });

export default mongoose.models.SensorReading ||
  mongoose.model('SensorReading', SensorReadingSchema);
