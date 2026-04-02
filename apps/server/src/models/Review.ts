import mongoose, { Schema, Document } from 'mongoose';
import type { Review } from '@my-project/shared';

export interface ReviewDocument extends Omit<Review, '_id'>, Document {}

const reviewSchema = new Schema<ReviewDocument>(
  {
    body: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<ReviewDocument>('Review', reviewSchema);