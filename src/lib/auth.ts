import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// ─── JWT Secret Validation ─────────────────────────────────────────────────
// SECURITY: No hardcoded fallback. JWT_SECRET MUST be set in environment.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "\n\x1b[41m\x1b[37m CRITICAL SECURITY ERROR \x1b[0m\n" +
    "JWT_SECRET environment variable is not set!\n" +
    "Set a strong random secret (32+ characters) in your .env file.\n" +
    "Example: JWT_SECRET=\"" + "x".repeat(48) + "\"\n"
  );
  // In production, refuse to start without a secret
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production.");
  }
}

// Final secret used for signing
const SIGNING_SECRET = JWT_SECRET || "";

if (JWT_SECRET && JWT_SECRET.length < 32) {
  console.warn(
    "\x1b[43m\x1b[30m WARNING \x1b[0m JWT_SECRET is shorter than 32 characters. " +
    "Use a longer, random secret for production security."
  );
}

// ─── Token Configuration ────────────────────────────────────────────────────
const TOKEN_EXPIRY = "7d";                 // Standard session: 7 days
const REMEMBER_ME_EXPIRY = "30d";          // Remember Me: 30 days
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;           // 7 days in seconds
const COOKIE_REMEMBER_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export { COOKIE_MAX_AGE, COOKIE_REMEMBER_MAX_AGE };

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  parentVendorId?: number;
}

export function signToken(payload: TokenPayload, rememberMe?: boolean): string {
  return jwt.sign(payload, SIGNING_SECRET, {
    expiresIn: rememberMe ? REMEMBER_ME_EXPIRY : TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SIGNING_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req: NextRequest): TokenPayload | null {
  const cookieHeader = req.cookies.get("stopshop_token")?.value;
  if (!cookieHeader) return null;
  return verifyToken(cookieHeader);
}

import { cookies } from "next/headers";

export async function getSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("stopshop_token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

// Middleware helper to require authentication
export function requireAuth(req: NextRequest): TokenPayload | NextResponse {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }
  return user;
}

// Middleware helper to require specific role(s)
export function requireRole(req: NextRequest, allowedRoles: string[]): TokenPayload | NextResponse {
  const authResult = requireAuth(req);
  
  // If it's a NextResponse, it means auth failed
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  // It's a TokenPayload
  if (!allowedRoles.includes(authResult.role)) {
    return NextResponse.json(
      { success: false, error: `Forbidden. Requires one of: ${allowedRoles.join(", ")}` },
      { status: 403 }
    );
  }
  
  return authResult;
}
