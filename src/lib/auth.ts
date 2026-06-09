import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "stopshop-super-secret-key-12345";

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "3650d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req: NextRequest): TokenPayload | null {
  const cookieHeader = req.cookies.get("stopshop_token")?.value;
  if (!cookieHeader) return null;
  return verifyToken(cookieHeader);
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
