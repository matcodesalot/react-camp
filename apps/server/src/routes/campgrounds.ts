import { Router, Request, Response } from "express";
import { CreateCampgroundSchema } from "@my-project/shared";
import { CampgroundModel } from "../models/Campground";
import "../models/User";
import { isLoggedIn } from "../middleware/auth";
import { AppError } from "../utils/AppError";

export const router = Router();

// Express 5: thrown errors in async routes are automatically forwarded to the
// error handler — no try/catch needed in the routes themselves.

// GET all campgrounds
router.get('/', async (req: Request, res: Response) => {
  const campgrounds = await CampgroundModel.find({});
  res.json(campgrounds);
});

// GET a single campground by ID
router.get('/:id', async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findById(req.params.id).populate('reviews').populate('author');
  console.log(campground);
  if (!campground) throw new AppError('Campground not found', 404);
  res.json(campground);
});

// POST a new campground
router.post('/', isLoggedIn, async (req: Request, res: Response) => {
  const data = CreateCampgroundSchema.parse(req.body);
  const campground = new CampgroundModel({ ...data, author: req.session!.user.id });
  await campground.save();
  res.status(201).json(campground);
});

// PUT update a campground by ID
router.put('/:id', isLoggedIn, async (req: Request, res: Response) => {
  const data = CreateCampgroundSchema.parse(req.body);
  const campground = await CampgroundModel.findByIdAndUpdate(
    req.params.id,
    data,
    { returnDocument: 'after', runValidators: true }
  );
  if (!campground) throw new AppError('Campground not found', 404);
  res.json(campground);
});

// DELETE a campground by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findByIdAndDelete(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  res.json({ message: 'Campground deleted' });
});

