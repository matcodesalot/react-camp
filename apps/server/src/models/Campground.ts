import mongoose, { Schema, Document } from 'mongoose';
import type { Campground } from '@my-project/shared';
import { ReviewModel } from './Review';

export interface CampgroundDocument extends Omit<Campground, '_id' | 'author' | 'reviews'>, Document {
  author: mongoose.Types.ObjectId;
  reviews: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

const campgroundSchema = new Schema<CampgroundDocument>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

// Cascade delete: when a campground is deleted via findByIdAndDelete (which
// triggers findOneAndDelete internally), remove all its associated reviews.
// We use a post hook so the deleted document is available as the first argument,
// avoiding an extra query to look up the review IDs beforehand.
campgroundSchema.post('findOneAndDelete', async function (campground: CampgroundDocument | null) {
  if (campground?.reviews?.length) {
    await ReviewModel.deleteMany({ _id: { $in: campground.reviews } });
  }
});

export const CampgroundModel = mongoose.model<CampgroundDocument>('Campground', campgroundSchema);