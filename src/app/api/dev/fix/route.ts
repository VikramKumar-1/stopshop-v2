import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
    }
    const user = requireRole(req, ["admin"]);
    if (user instanceof NextResponse) return user;

    const orders = await prisma.order.findMany({
      where: { status: "RETURN_APPROVED", returnAwbCode: null }
    });

    for (const o of orders) {
      await prisma.order.update({
        where: { id: o.id },
        data: { returnAwbCode: `RET-AWB-FIX-${o.id}` }
      });
    }

    return NextResponse.json({ success: true, fixedCount: orders.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
