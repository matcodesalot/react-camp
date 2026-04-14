import type { User, CreateUserInput } from "@my-project/shared";
import { apiFetch } from "../lib/api";

export async function getUsers(): Promise<User[]> {
  const res = await apiFetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const res = await apiFetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}