import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }
  const user = requireRole(req, ["admin"]);
  if (user instanceof NextResponse) return user;

  const settlements = await prisma.settlement.findMany();
  const vendorIds = Array.from(new Set(settlements.map(s => s.vendorId)));
  const vendors = await prisma.user.findMany({ where: { id: { in: vendorIds } } });
  
  return NextResponse.json({
    settlementCount: settlements.length,
    vendorIds,
    vendorsFound: vendors.map(v => v.id)
  });
}
