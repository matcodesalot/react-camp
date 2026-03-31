import mongoose, { Schema, Document } from "mongoose";
import type { User } from "@my-project/shared";

// Extend the shared Zod-inferred type with Mongoose's Document
export interface UserDocument extends Omit<User, "_id">, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);