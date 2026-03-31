import { Router } from "express";
import { CreateUserSchema } from "@my-project/shared";
import { UserModel } from "../models/User";

export const usersRouter = Router();

// GET all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find().lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// POST create a user — validate body with the shared Zod schema
usersRouter.post("/", async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    // Return Zod's formatted errors to the client
    return res.status(400).json({ errors: result.error.format() });
  }

  try {
    const user = await UserModel.create(result.data);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
});