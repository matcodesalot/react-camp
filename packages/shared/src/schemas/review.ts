import { z } from 'zod';

export const ReviewSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectIds are hex strings, not UUIDs
  body: z.string().min(1, 'Body is required'),
  rating: z.number({ error: 'Rating must be a number' }).min(1, 'Rating must be 1 or greater').max(5, 'Rating must be 5 or less'),
});

export type Review = z.infer<typeof ReviewSchema>;

export const CreateReviewSchema = ReviewSchema.omit({ _id: true });
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;