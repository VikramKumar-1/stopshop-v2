// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const SIGNING_SECRET = process.env.JWT_SECRET || "";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=MissingMagicToken", request.url));
    }

    let payload: any;
    try {
      payload = jwt.verify(token, SIGNING_SECRET);
    } catch (err) {
      return NextResponse.redirect(new URL("/login?error=InvalidMagicToken", request.url));
    }

    if (payload.type !== "worker-magic") {
      return NextResponse.redirect(new URL("/login?error=InvalidTokenType", request.url));
    }

    const worker = await prisma.user.findUnique({ where: { id: payload.workerId } });
    if (!worker || worker.parentVendorId !== payload.vendorId) {
      // If the worker was unassigned after generating the QR, reject access
      return NextResponse.redirect(new URL("/login?error=WorkerAccessRevoked", request.url));
    }

    // Generate a permanent session token for the worker (valid for 1 year)
    // So they never have to scan again unless they log out
    const sessionToken = jwt.sign(
      {
        userId: worker.id,
        email: worker.email,
        role: worker.role,
        parentVendorId: worker.parentVendorId
      },
      SIGNING_SECRET,
      { expiresIn: "365d" }
    );

    const response = NextResponse.redirect(new URL("/worker/studio", request.url));
    
    response.cookies.set("stopshop_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60, // 365 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Worker magic login error:", error);
    return NextResponse.redirect(new URL("/login?error=MagicLoginFailed", request.url));
  }
}
