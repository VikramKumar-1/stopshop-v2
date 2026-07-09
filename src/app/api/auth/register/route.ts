import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/features/auth/services/auth";
import { COOKIE_MAX_AGE, COOKIE_REMEMBER_MAX_AGE } from "@/lib/auth";
import { registerLimiter, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // ─── Rate Limiting ────────────────────────────────────────────────
    const ip = getClientIp(req);
    const rateCheck = registerLimiter.check(ip);
    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const { name, email, password, role, rememberMe } = await req.json();

    // Call service layer for validation, hashing, and database insertion
    const { user, token } = await registerUser(name, email, password, role, rememberMe);

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set JWT token cookie with secure, capped maxAge
    response.cookies.set({
      name: "stopshop_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? COOKIE_REMEMBER_MAX_AGE : COOKIE_MAX_AGE,
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: error.message?.includes("required") || error.message?.includes("least") ? 400 : 500 }
    );
  }
}
