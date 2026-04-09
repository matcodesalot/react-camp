import { z } from 'zod';
import { UserSchema } from './user';
import { ReviewSchema } from './review';

export const CampgroundSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  price: z.number({ error: 'Price must be a number' }).min(0, 'Price must be 0 or greater'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  image: z.url('Must be a valid URL'),
  author: z.union([z.string(), UserSchema]).nullable(),
  reviews: z.array(z.union([z.string(), ReviewSchema])).default([]),
});

export type Campground = z.infer<typeof CampgroundSchema>;

export const PopulatedCampgroundSchema = CampgroundSchema.extend({
  author: UserSchema.nullable(),
  reviews: z.array(ReviewSchema).default([]),
});
export type PopulatedCampground = z.infer<typeof PopulatedCampgroundSchema>;

export const CreateCampgroundSchema = CampgroundSchema.omit({ _id: true, author: true, reviews: true });
export type CreateCampgroundInput = z.infer<typeof CreateCampgroundSchema>;