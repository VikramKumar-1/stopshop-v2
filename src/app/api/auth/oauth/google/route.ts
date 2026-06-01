import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirect_uri = `${appUrl}/api/auth/oauth/google/callback`;

  if (!client_id) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID is not configured in .env" },
      { status: 500 }
    );
  }

  // Get the redirect and role query parameters from search params to pass along in state
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "";
  const role = searchParams.get("role") || "user";
  const state = `${role}:${redirect}`;

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    client_id
  )}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&response_type=code&scope=${encodeURIComponent(
    "openid email profile"
  )}&access_type=offline&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(oauthUrl);
}
