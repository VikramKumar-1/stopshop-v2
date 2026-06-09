import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let whereClause: any = {};

    if (user.role === "user" || user.role === "vendor") {
      whereClause.userId = user.userId;
    }
    // Admins see everything

    if (status) {
      whereClause.status = status;
    }

    const returns = await prisma.returnRequest.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            orderNumber: true,
            totalPaise: true,
            createdAt: true,
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    images: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, returns });
  } catch (error: any) {
    console.error("Fetch returns error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
