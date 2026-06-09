import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = getAuthUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const vendorId = parseInt(params.id);
    const body = await req.json();
    const { allowedCategories } = body;

    const updatedVendor = await prisma.user.update({
      where: { id: vendorId, role: "vendor" },
      data: { allowedCategories },
    });

    return NextResponse.json({ success: true, allowedCategories: updatedVendor.allowedCategories });
  } catch (error: any) {
    console.error("Admin vendor permissions error:", error);
    return NextResponse.json({ error: "Failed to update vendor permissions" }, { status: 500 });
  }
}
