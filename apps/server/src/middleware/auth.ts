import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { AppError } from "../utils/AppError";
import { CampgroundModel } from "../models/Campground";
import { ReviewModel } from "../models/Review";

type Session = typeof auth.$Infer.Session;

// Extend Express Request so route handlers can access req.session
// after isLoggedIn runs (e.g. req.session!.user.id)
declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

/**
 * Route-level middleware that verifies the caller has a valid
 * Better Auth session. Attach to any route that requires login:
 *
 *   router.post('/', isLoggedIn, handler)
 *
 * On success the full session (user + session metadata) is
 * available as req.session for downstream handlers.
 */
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) throw new AppError('Unauthorized', 401);
  req.session = session;
  next();
};

/**
 * Route-level middleware that verifies the logged-in user is the author of
 * the campground identified by :id. Must be used after isLoggedIn.
 *
 *   router.put('/:id', isLoggedIn, isAuthor, handler)
 */
export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const campground = await CampgroundModel.findById(req.params.id);
  if (!campground) throw new AppError('Campground not found', 404);
  if (campground.author.toString() !== req.session!.user.id) {
    throw new AppError('You do not have permission to do that', 403);
  }
  next();
};

/**
 * Route-level middleware that verifies the logged-in user is the author of
 * the review identified by :reviewId. Must be used after isLoggedIn.
 *
 *   router.delete('/:reviewId', isLoggedIn, isReviewAuthor, handler)
 */
export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const review = await ReviewModel.findById(req.params.reviewId);
  if (!review) throw new AppError('Review not found', 404);
  if (review.author.toString() !== req.session!.user.id) {
    throw new AppError('You do not have permission to do that', 403);
  }
  next();
};
