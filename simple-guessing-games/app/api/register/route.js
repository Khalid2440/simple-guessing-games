import { NextResponse } from "next/server";
import { registerUser } from "@/app/api/_lib/authStore";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (name.length < 2) {
    return NextResponse.json({ message: "Name must be at least 2 characters." }, { status: 422 });
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 422 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 422 });
  }

  const result = await registerUser({ name, email, password });
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json(
    {
      message: "Registration successful.",
      token: result.token,
      user: result.user,
    },
    { status: result.status }
  );
}
