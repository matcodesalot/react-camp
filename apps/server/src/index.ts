// import express from "express";
// import cors from "cors";
// import { connectDB } from "./db/connect";
// import { usersRouter } from "./routes/users";

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { ZodError } from 'zod';
import { CampgroundSchema, ReviewSchema } from '@my-project/shared';
import { CampgroundModel } from './models/Campground';
import { ReviewModel } from './models/Review';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Custom Error Class ───────────────────────────────────────────────────────

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// ─── DB Connection ────────────────────────────────────────────────────────────

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/react-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
// app.use("/api/users", usersRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Express 5: thrown errors in async routes are automatically forwarded to the
// error handler — no try/catch needed in the routes themselves.

app.get('/api/campgrounds', async (req: Request, res: Response) => {
  const campgrounds = await CampgroundModel.find({});
  res.json(campgrounds);
});

app.get('/api/campgrounds/:id', async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findById(req.params.id).populate('reviews');
  if (!campground) throw new AppError('Campground not found', 404);
  res.json(campground);
});

app.post('/api/campgrounds', async (req: Request, res: Response) => {
  const data = CampgroundSchema.parse(req.body);
  const campground = new CampgroundModel(data);
  await campground.save();
  res.status(201).json(campground);
});

app.put('/api/campgrounds/:id', async (req: Request, res: Response) => {
  const data = CampgroundSchema.parse(req.body);
  const campground = await CampgroundModel.findByIdAndUpdate(
    req.params.id,
    data,
    { returnDocument: 'after', runValidators: true }
  );
  if (!campground) throw new AppError('Campground not found', 404);
  res.json(campground);
});

app.delete('/api/campgrounds/:id', async (req: Request, res: Response) => {
  const campground = await CampgroundModel.findByIdAndDelete(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  res.json({ message: 'Campground deleted' });
});

app.post('/api/campgrounds/:id/reviews', async (req: Request, res: Response) => {
  const data = ReviewSchema.parse(req.body);
  const review = new ReviewModel(data);
  const campground = await CampgroundModel.findById(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  campground.reviews.push(review._id);
  await review.save();
  await campground.save();
  res.status(201).json(review);
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot ${req.method} ${req.path}`, 404));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be registered last and have exactly 4 params for Express to treat it
// as an error-handling middleware.

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  // Zod: schema validation failed
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({ error: 'Validation failed', details });
  }

  // Mongoose: invalid ObjectId (e.g. /campgrounds/not-an-id)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Mongoose: schema validation failed
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // MongoDB: duplicate key (e.g. unique index violation)
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate key', details: err.keyValue });
  }

  // Our own AppError (e.g. 404 not found)
  if (err.name === 'AppError') {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Fallback for unexpected errors
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ─── Static / Production ──────────────────────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../../apps/client/dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../apps/client/dist/index.html'));
  });
}

// Connect to DB, then start the server
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});