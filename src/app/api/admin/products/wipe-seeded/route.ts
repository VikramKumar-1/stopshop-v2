import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    // Delete related child records to prevent foreign key errors
    await prisma.review.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.userIntent.deleteMany({});
    await prisma.targetedOffer.deleteMany({});
    await prisma.productView.deleteMany({});
    await prisma.productPair.deleteMany({});
    await prisma.customPayout.deleteMany({});

    // Delete all products
    const result = await prisma.product.deleteMany({});

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully deleted ${result.count} products and cleared related telemetry/cart data.`,
    });
  } catch (error: any) {
    console.error("Failed to wipe products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to wipe products" },
      { status: 500 }
    );
  }
}
