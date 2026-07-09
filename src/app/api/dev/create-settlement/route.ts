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

    const vendor = await prisma.user.findFirst({ where: { role: 'vendor' } });
    if (!vendor) return NextResponse.json({ error: "No vendor" });

    const order = await prisma.order.findFirst();
    if (!order) return NextResponse.json({ error: "No order" });

    const settlement = await prisma.settlement.create({
      data: {
        orderId: order.id,
        vendorId: vendor.id,
        orderAmountPaise: 100000, 
        commissionPaise: 10000,   
        vendorPayoutPaise: 90000, 
        status: "ELIGIBLE",       
        holdUntil: new Date(),
      }
    });
    return NextResponse.json({ success: true, settlement });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
