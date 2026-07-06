import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, sessionId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "productId is required" }, { status: 400 });
    }

    const session = getAuthUser(req);
    const userId = session?.userId || null;

    // Track the view
    await prisma.productView.create({
      data: {
        productId: Number(productId),
        userId: userId,
        sessionId: sessionId || "guest",
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to track view:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
