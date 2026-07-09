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

    const settlements = await prisma.settlement.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            deliveredAt: true,
            paymentMethod: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    if (settlements.length > 0) {
       const vendorIds = Array.from(new Set(settlements.map(s => s.vendorId)));
       const vendors = await prisma.user.findMany({
          where: { id: { in: vendorIds } },
       });
       return NextResponse.json({
         success: true,
         settlementsCount: settlements.length,
         vendorsCount: vendors.length,
         settlements,
         vendors
       });
    }
    return NextResponse.json({ success: true, message: "No settlements found" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
