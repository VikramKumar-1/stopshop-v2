// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import jwt from "jsonwebtoken";

const SIGNING_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("stopshop_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "vendor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { workerId } = await request.json();

    if (!workerId) {
      return NextResponse.json({ success: false, error: "Worker ID is required" }, { status: 400 });
    }

    const worker = await prisma.user.findUnique({ where: { id: workerId } });
    if (!worker || worker.parentVendorId !== user.userId) {
      return NextResponse.json({ success: false, error: "Worker is not assigned to you" }, { status: 403 });
    }

    // Generate a permanent magic token valid for 365 days
    // This allows the QR code to be printed and used repeatedly
    const magicToken = jwt.sign(
      { 
        type: "worker-magic",
        workerId: worker.id,
        vendorId: user.userId
      },
      SIGNING_SECRET,
      { expiresIn: "365d" }
    );

    return NextResponse.json({ success: true, magicToken });
  } catch (error) {
    console.error("Magic link generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate magic link" }, { status: 500 });
  }
}
