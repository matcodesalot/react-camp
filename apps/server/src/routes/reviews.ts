import { Router, Request, Response } from "express";
import { ReviewSchema } from "@my-project/shared";
import { CampgroundModel } from "../models/Campground";
import { AppError } from "../utils/AppError";
import { ReviewModel } from "../models/Review";

export const router = Router({ mergeParams: true });

// Express 5: thrown errors in async routes are automatically forwarded to the
// error handler — no try/catch needed in the routes themselves.

// POST a new review
router.post('/', async (req: Request, res: Response) => {
  const data = ReviewSchema.parse(req.body);
  const review = new ReviewModel(data);
  const campground = await CampgroundModel.findById(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  campground.reviews.push(review._id);
  await review.save();
  await campground.save();
  res.status(201).json(review);
});

// DELETE a review by ID
router.delete('/:reviewId', async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findById(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  campground.reviews.pull(req.params.reviewId);
  await ReviewModel.findByIdAndDelete(req.params.reviewId);
  await campground.save();
  res.json({ message: 'Review deleted' });
});