import { z } from 'zod';

export const CampgroundSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectIds are hex strings, not UUIDs
  title: z.string().min(1, 'Title is required'),
  price: z.number({ error: 'Price must be a number' }).min(0, 'Price must be 0 or greater'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  image: z.url('Must be a valid URL'),
  reviews: z.array(z.string()).optional(),
});

export type Campground = z.infer<typeof CampgroundSchema>;

export const CreateCampgroundSchema = CampgroundSchema.omit({ _id: true });
export type CreateCampgroundInput = z.infer<typeof CreateCampgroundSchema>;