import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const vendors = await prisma.user.findMany({
      where: { role: "vendor" },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        location: true,
        gstin: true,
        aadhaar: true,
        pan: true,
        aadhaarUrl: true,
        panUrl: true,
        docUrl: true,
        vendorStatus: true,
        allowedCategories: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    console.error("Admin vendors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
