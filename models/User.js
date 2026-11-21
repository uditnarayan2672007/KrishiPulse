import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['USER', 'FARMER', 'ADMIN', 'RESEARCHER'],
      default: 'FARMER',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
