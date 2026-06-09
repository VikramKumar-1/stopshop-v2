import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session || session.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { mobile, gstin, aadhaar, pan, docUrl } = body;

    if (!mobile || !gstin || !aadhaar || !pan) {
      return NextResponse.json({ error: "All fields are required to submit profile for review." }, { status: 400 });
    }

    // Update user profile and set status to IN_REVIEW
    const updatedVendor = await prisma.user.update({
      where: { id: session.userId },
      data: {
        mobile,
        gstin,
        aadhaar,
        pan,
        docUrl,
        vendorStatus: "IN_REVIEW",
      },
    });

    return NextResponse.json({ success: true, vendor: updatedVendor });
  } catch (error: any) {
    console.error("Vendor profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
