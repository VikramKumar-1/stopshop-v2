import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/features/auth/services/auth";
import { COOKIE_MAX_AGE, COOKIE_REMEMBER_MAX_AGE } from "@/lib/auth";
import { loginLimiter, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // ─── Rate Limiting ────────────────────────────────────────────────
    const ip = getClientIp(req);
    const rateCheck = loginLimiter.check(ip);
    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const { email, password, rememberMe } = await req.json();

    // Call service layer for authentication and signing token
    const { user, token } = await loginUser(email, password, rememberMe);

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set HTTP-only cookie with secure, capped maxAge
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
    console.error("Login error:", error);
    // SECURITY: Generic error message — don't reveal if email exists or password is wrong
    return NextResponse.json(
      { error: error.message || "Invalid email or password" },
      { status: 401 }
    );
  }
}
