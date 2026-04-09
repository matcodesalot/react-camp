import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  createdAt: z.coerce.date().optional(),
});

// Derive a TypeScript type directly from the schema — no duplication
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ _id: true, createdAt: true });
export type CreateUserInput = z.infer<typeof CreateUserSchema>;