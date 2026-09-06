import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  UPSTREAM_API_URL: z.string().url(),
});

export const env = serverSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  UPSTREAM_API_URL: process.env.UPSTREAM_API_URL,
});
