import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const settlements = await prisma.settlement.findMany();
  const vendorIds = Array.from(new Set(settlements.map(s => s.vendorId)));
  const vendors = await prisma.user.findMany({ where: { id: { in: vendorIds } } });
  
  return NextResponse.json({
    settlementCount: settlements.length,
    vendorIds,
    vendorsFound: vendors.map(v => v.id)
  });
}
