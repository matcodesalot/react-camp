import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "",  // empty = same origin, uses Vite proxy
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
