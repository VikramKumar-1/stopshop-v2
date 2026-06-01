import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, TokenPayload } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state") || "";
    let targetRole = "user";
    let redirectDest = "";
    if (state.includes(":")) {
      const separatorIdx = state.indexOf(":");
      targetRole = state.substring(0, separatorIdx) || "user";
      redirectDest = state.substring(separatorIdx + 1);
    } else {
      redirectDest = state;
    }

    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirect_uri = `${appUrl}/api/auth/oauth/google/callback`;

    if (!code) {
      return NextResponse.redirect(`${appUrl}/profile?error=No+authorization+code+received`);
    }

    if (!client_id || !client_secret) {
      return NextResponse.redirect(`${appUrl}/profile?error=Google+OAuth+is+not+fully+configured`);
    }

    // Exchange authorization code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(`${appUrl}/profile?error=Token+exchange+failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile info from Google API
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoRes.ok) {
      return NextResponse.redirect(`${appUrl}/profile?error=Failed+to+fetch+user+profile`);
    }

    const profile = await userinfoRes.json();
    const email = profile.email;
    const name = profile.name || email.split("@")[0];

    if (!email) {
      return NextResponse.redirect(`${appUrl}/profile?error=Email+not+provided+by+Google`);
    }

    // Check if the user is already registered in our database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // If user exists as a regular user, but authenticating as a vendor, upgrade their role
      if (targetRole === "vendor" && user.role === "user") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: "vendor" },
        });
      }
    } else {
      // If user is new, automatically sign them up
      const customPasswordPlaceholder = "google_oauth_placeholder_password";
      const hashedPassword = await bcrypt.hash(customPasswordPlaceholder, 10);

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: targetRole === "vendor" ? "vendor" : "user",
        },
      });
    }

    // Generate session JWT token
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const token = signToken(payload);

    // Redirect destination (defaults to homepage, vendor dashboard, or the saved redirect path)
    const destination = redirectDest 
      ? `${appUrl}${redirectDest}` 
      : (targetRole === "vendor" ? `${appUrl}/vendor/dashboard` : `${appUrl}/`);

    const response = NextResponse.redirect(destination);

    // Set auth session token cookie
    response.cookies.set({
      name: "stopshop_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("OAuth Callback Error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/profile?error=Authentication+failed+due+to+server+error`);
  }
}
