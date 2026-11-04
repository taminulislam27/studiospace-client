import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name } = session.user;
  const token = jwt.sign({ email, name }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
