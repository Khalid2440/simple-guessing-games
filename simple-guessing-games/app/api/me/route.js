import { NextResponse } from "next/server";
import { bearerTokenFromRequest, getUserByToken } from "@/app/api/_lib/authStore";

export const runtime = "nodejs";

export async function GET(request) {
  const token = bearerTokenFromRequest(request);
  const result = await getUserByToken(token);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ user: result.user });
}
