import { z } from "zod";

export const rejiRoleSchema = z.enum(["OWNER", "CASHIER"]);

export const sessionSchema = z.object({
  authenticated: z.boolean(),
  role: rejiRoleSchema.nullable(),
  name: z.string().nullable(),
});

export const pinLoginResponseSchema = z.object({
  role: rejiRoleSchema,
  name: z.string(),
});

export type RejiRole = z.infer<typeof rejiRoleSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type AuthenticatedSession = {
  authenticated: true;
  role: RejiRole;
  name: string;
};
