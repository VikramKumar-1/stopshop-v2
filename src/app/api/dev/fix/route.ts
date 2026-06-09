import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
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
