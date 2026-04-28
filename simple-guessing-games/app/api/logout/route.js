import { NextResponse } from "next/server";
import { bearerTokenFromRequest, logoutByToken } from "@/app/api/_lib/authStore";

export const runtime = "nodejs";

async function handleLogout(request) {
  const token = bearerTokenFromRequest(request);
  const result = await logoutByToken(token);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ message: result.message });
}

export async function GET(request) {
  return handleLogout(request);
}

export async function POST(request) {
  return handleLogout(request);
}
