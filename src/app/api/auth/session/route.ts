import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("reji-role")?.value;
  const name = cookieStore.get("reji-name")?.value;
  const hasToken = Boolean(cookieStore.get("reji-access-token")?.value);

  if (!hasToken || (role !== "OWNER" && role !== "CASHIER") || !name) {
    return NextResponse.json({ authenticated: false, role: null, name: null });
  }

  return NextResponse.json({ authenticated: true, role, name });
}
