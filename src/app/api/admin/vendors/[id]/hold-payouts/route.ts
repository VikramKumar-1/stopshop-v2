import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const vendorId = parseInt(params.id);
    if (isNaN(vendorId)) return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });

    const body = await req.json();
    const { payoutsPaused } = body;

    if (typeof payoutsPaused !== "boolean") {
       return NextResponse.json({ error: "Invalid payoutsPaused boolean value" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: vendorId },
      data: { payoutsPaused }
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error: any) {
    console.error("Hold payouts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
