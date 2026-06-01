import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

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
