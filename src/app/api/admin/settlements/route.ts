import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = requireRole(req, ["admin", "vendor"]);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const vendorId = searchParams.get("vendorId");

    let whereClause: any = {};

    if (user.role === "vendor") {
       whereClause.vendorId = user.userId;
    } else if (vendorId) {
       whereClause.vendorId = parseInt(vendorId);
    }

    if (status) {
       whereClause.status = status;
    }

    const settlements = await prisma.settlement.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            deliveredAt: true,
            paymentMethod: true,
            currency: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Compute summary dashboard numbers
    let summary = {
      hold: 0,
      eligible: 0,
      settled: 0,
      disputed: 0
    };

    settlements.forEach(s => {
       if (s.status === "HOLD") summary.hold += s.vendorPayoutPaise;
       if (s.status === "ELIGIBLE") summary.eligible += s.vendorPayoutPaise;
       if (s.status === "SETTLED") summary.settled += s.vendorPayoutPaise;
       if (s.status === "DISPUTED") summary.disputed += s.vendorPayoutPaise;
    });

    // Fetch unique vendor users
    const vendorIds = Array.from(new Set(settlements.map(s => s.vendorId)));
    const vendors = await prisma.user.findMany({
      where: { id: { in: vendorIds } },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        location: true,
        // Trigger HMR update
      }
    });

    const customPayouts = await prisma.customPayout.findMany({
      where: whereClause,
      include: {
        product: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    // Group them
    const groupedSettlements = vendors.map(vendor => {
      const vendorSettlements = settlements.filter(s => s.vendorId === vendor.id);
      const vendorCustomPayouts = customPayouts.filter(c => c.vendorId === vendor.id);
      
      let vendorSummary = {
        hold: 0,
        eligible: 0,
        settled: 0,
        disputed: 0
      };

      vendorSettlements.forEach(s => {
         if (s.status === "HOLD") vendorSummary.hold += s.vendorPayoutPaise;
         if (s.status === "ELIGIBLE") vendorSummary.eligible += s.vendorPayoutPaise;
         if (s.status === "SETTLED") vendorSummary.settled += s.vendorPayoutPaise;
         if (s.status === "DISPUTED") vendorSummary.disputed += s.vendorPayoutPaise;
      });

      return {
        vendor,
        summary: vendorSummary,
        settlements: vendorSettlements,
        customPayouts: vendorCustomPayouts
      };
    });

    // Sort groups by eligible amount descending
    groupedSettlements.sort((a, b) => b.summary.eligible - a.summary.eligible);

    const settings = await prisma.adminSettings.findFirst();
    return NextResponse.json({ success: true, settlements, groupedSettlements, summary, settings });
  } catch (error: any) {
    console.error("Fetch settlements error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Delete settled settlements older than 1 month
    const result = await prisma.settlement.deleteMany({
      where: {
        status: "SETTLED",
        settledAt: {
          lt: oneMonthAgo
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} settled records older than 1 month.`,
      count: result.count
    });

  } catch (error: any) {
    console.error("Failed to delete old settlements:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
