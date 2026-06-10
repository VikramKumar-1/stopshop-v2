import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session || session.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Set vendor status to IN_REVIEW so they appear in admin KYC queue.
    // Profile data has already been saved by /api/auth/me PATCH before this call.
    const updatedVendor = await prisma.user.update({
      where: { id: session.userId },
      data: {
        vendorStatus: "IN_REVIEW",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mobile: true,
        location: true,
        artisanId: true,
        gstin: true,
        aadhaar: true,
        pan: true,
        aadhaarUrl: true,
        panUrl: true,
        docUrl: true,
        vendorStatus: true,
        allowedCategories: true,
      },
    });

    return NextResponse.json({ success: true, vendor: updatedVendor });
  } catch (error: any) {
    console.error("Vendor profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
