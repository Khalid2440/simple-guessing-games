import { NextResponse } from "next/server";
import { loginUser } from "@/app/api/_lib/authStore";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid || password.length < 6) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 422 });
  }

  const result = await loginUser({ email, password });
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({
    message: "Login successful.",
    token: result.token,
    user: result.user,
  });
}
