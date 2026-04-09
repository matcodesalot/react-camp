import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { AppError } from "../utils/AppError";

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
