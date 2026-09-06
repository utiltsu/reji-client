import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { upstreamFetch } from "@/lib/upstream";

const ACCESS_TOKEN_COOKIE = "reji-access-token";
const ROLE_COOKIE = "reji-role";
const NAME_COOKIE = "reji-name";

export async function POST(request: Request) {
  const response = await upstreamFetch("/api/v1/auth/pin", undefined, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: request.body,
  });
  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    return NextResponse.json(body, { status: response.status });
  }

  if (!isPinLoginResponse(body)) {
    return NextResponse.json(
      { code: "INVALID_UPSTREAM_RESPONSE", message: "บริการตอบกลับไม่ถูกต้อง" },
      { status: 502 },
    );
  }

  const result = NextResponse.json({ role: body.role, name: body.name });
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    path: "/",
  };
  result.cookies.set(ACCESS_TOKEN_COOKIE, body.token, cookieOptions);
  result.cookies.set(ROLE_COOKIE, body.role, cookieOptions);
  result.cookies.set(NAME_COOKIE, body.name, cookieOptions);
  return result;
}

function isPinLoginResponse(value: unknown): value is {
  token: string;
  role: "OWNER" | "CASHIER";
  name: string;
} {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.token === "string" &&
    (candidate.role === "OWNER" || candidate.role === "CASHIER") &&
    typeof candidate.name === "string"
  );
}
