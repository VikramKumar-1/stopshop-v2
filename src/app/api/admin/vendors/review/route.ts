import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { vendorId, action } = body; // action is 'APPROVE' or 'REJECT'

    if (!vendorId || !action) {
      return NextResponse.json({ error: "Vendor ID and action required" }, { status: 400 });
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updatedVendor = await prisma.user.update({
      where: { id: vendorId, role: "vendor" },
      data: { vendorStatus: newStatus },
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error: any) {
    console.error("Admin vendor review error:", error);
    return NextResponse.json({ error: "Failed to update vendor status" }, { status: 500 });
  }
}
