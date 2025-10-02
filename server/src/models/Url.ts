import mongoose, { type Document } from 'mongoose';

export interface IUrl extends Document {
  shortCode: string;
  originalUrl: string;
  customDomain?: string;
  createdAt: Date;
  clicks: number;
  lastClickedAt?: Date;
  expiresAt?: Date;
  userId?: string;
}

const urlSchema = new mongoose.Schema<IUrl>({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  customDomain: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  lastClickedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true,
  },
  userId: {
    type: String,
    default: null,
    index: true,
  },
});

// Index for efficient queries
urlSchema.index({ shortCode: 1, customDomain: 1 });

export const Url = mongoose.model<IUrl>('Url', urlSchema);