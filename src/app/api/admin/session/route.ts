import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json();
    if (
      typeof id !== "string" ||
      typeof password !== "string" ||
      !verifyAdminCredentials(id, password)
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Admin session creation failed", error);
    return NextResponse.json(
      { error: "Admin session is not configured" },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    expires: new Date(0),
    path: "/",
  });
  return response;
}
