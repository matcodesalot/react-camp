import { Router, Request, Response } from "express";
import { z } from "zod";
import { CreateUserSchema } from "@my-project/shared";
import { UserModel } from "../models/User";

export const router = Router();

// GET all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// POST create a user — validate body with the shared Zod schema
router.post("/", async (req: Request, res: Response) => {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    // Return Zod's formatted errors to the client
    return res.status(400).json({ errors: z.flattenError(result.error) });
  }

  try {
    const user = await UserModel.create(result.data);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
});