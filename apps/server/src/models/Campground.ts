import mongoose, { Schema, Document } from 'mongoose';
import type { Campground } from '@my-project/shared';

export interface CampgroundDocument extends Omit<Campground, '_id'>, Document {}

const campgroundSchema = new Schema<CampgroundDocument>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const CampgroundModel = mongoose.model<CampgroundDocument>('Campground', campgroundSchema);