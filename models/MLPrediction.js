import mongoose from 'mongoose';

const MLPredictionSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    sensorReadingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SensorReading',
      required: false,
    },
    irrigationRequired: {
      type: Boolean,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      default: null,
    },
    modelVersion: {
      type: String,
      default: '1.0',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: 'ml_predictions',
  }
);

// Compound index per DatabaseSchema.md.txt
MLPredictionSchema.index({ deviceId: 1, createdAt: -1 });

export default mongoose.models.MLPrediction ||
  mongoose.model('MLPrediction', MLPredictionSchema);
