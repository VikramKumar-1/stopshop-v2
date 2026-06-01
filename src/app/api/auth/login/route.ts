import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/features/auth/services/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json();

    // Call service layer for authentication and signing token
    const { user, token } = await loginUser(email, password);

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set HTTP-only cookie
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: error.message.includes("Invalid") ? 401 : 400 }
    );
  }
}
