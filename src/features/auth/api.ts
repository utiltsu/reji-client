import { apiClient } from "../../lib/api-client";
import { pinLoginResponseSchema, sessionSchema, type Session } from "./schemas";

export async function getSession(): Promise<Session> {
  const response: unknown = await apiClient<unknown>("/api/auth/session");
  return sessionSchema.parse(response);
}

export async function loginByPin(pin: string): Promise<Session> {
  const response: unknown = await apiClient<unknown>("/api/auth/pin", {
    method: "POST",
    body: JSON.stringify({ pin }),
  });
  const parsed = pinLoginResponseSchema.parse(response);
  return {
    authenticated: true,
    role: parsed.role,
    name: parsed.name,
  };
}
