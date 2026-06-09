import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
