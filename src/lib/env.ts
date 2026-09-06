import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  UPSTREAM_API_URL: z.string().url(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("Reji"),
});

const serverEnv =
  typeof window === "undefined"
    ? serverSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        UPSTREAM_API_URL: process.env.UPSTREAM_API_URL,
      })
    : null;

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

export const env = {
  get NODE_ENV() {
    if (serverEnv === null) {
      throw new Error("Server environment is not available in the browser");
    }
    return serverEnv.NODE_ENV;
  },
  get UPSTREAM_API_URL() {
    if (serverEnv === null) {
      throw new Error("Server environment is not available in the browser");
    }
    return serverEnv.UPSTREAM_API_URL;
  },
};
