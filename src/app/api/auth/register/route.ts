import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/features/auth/services/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, rememberMe } = await req.json();

    // Call service layer for validation, hashing, and database insertion
    const { user, token } = await registerUser(name, email, password, role);

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set JWT token cookie
    const cookieOptions: any = {
      name: "stopshop_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 365 * 10; // 10 years
    }

    response.cookies.set(cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: error.message.includes("required") ? 400 : 500 }
    );
  }
}
