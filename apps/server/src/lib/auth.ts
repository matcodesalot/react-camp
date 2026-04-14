import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import "./db";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.getClient().db(), {
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],
  advanced: isProd
    ? {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
          partitioned: true,
        },
      }
    : {},
});