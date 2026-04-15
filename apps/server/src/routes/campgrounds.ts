import { Router, Request, Response } from "express";
import { CreateCampgroundSchema } from "@my-project/shared";
import { CampgroundModel } from "../models/Campground";
import "../models/User";
import { isLoggedIn, isAuthor } from "../middleware/auth";
import { AppError } from "../utils/AppError";

export const router = Router();

// Express 5: thrown errors in async routes are automatically forwarded to the
// error handler — no try/catch needed in the routes themselves.

// Controllers are skipped here intentionally: each handler is a one- or
// two-liner with no shared logic, so extracting them into a separate file
// would only add indirection without any organisational benefit.

// GET all campgrounds
router.get('/', async (req: Request, res: Response) => {
  const campgrounds = await CampgroundModel.find({});
  res.json(campgrounds);
});

// GET a single campground by ID
router.get('/:id', async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
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
router.put('/:id', isLoggedIn, isAuthor, async (req: Request, res: Response) => {
  const data = CreateCampgroundSchema.parse(req.body);
  const { image, ...rest } = data;
  const update = image === null
    ? { ...rest, $unset: { image: 1 } }
    : { ...rest, image };
  const campground = await CampgroundModel.findByIdAndUpdate(
    req.params.id,
    update,
    { returnDocument: 'after', runValidators: true }
  );
  if (!campground) throw new AppError('Campground not found', 404);
  res.json(campground);
});

// DELETE a campground by ID
router.delete('/:id', isLoggedIn, isAuthor, async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findByIdAndDelete(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  res.json({ message: 'Campground deleted' });
});

