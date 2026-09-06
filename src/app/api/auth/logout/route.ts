import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  for (const name of ["reji-access-token", "reji-role", "reji-name"]) {
    response.cookies.delete(name);
  }
  return response;
}
