import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { ZodError } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { toNodeHandler } from 'better-auth/node';
import './lib/db';
import { auth } from './lib/auth';
import { router as campgroundsRouter } from './routes/campgrounds';
import { router as reviewsRouter } from './routes/reviews';
import { AppError } from './utils/AppError';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Better Auth handler must be mounted before express.json()
app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.use('/api/campgrounds', campgroundsRouter);
app.use('/api/campgrounds/:id/reviews', reviewsRouter);

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
  app.get('*splat', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../apps/client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});