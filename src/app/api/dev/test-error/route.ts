import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const revenueGroups = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { 
         vendorId: 9,
         order: {
            status: {
               notIn: ["CANCELLED", "RETURNED", "RETURN_APPROVED"]
            }
         }
      },
      _sum: { totalPaise: true }
    });
    return NextResponse.json({ success: true, revenueGroups });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 200 });
  }
}
