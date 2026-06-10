import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
       return NextResponse.json({ success: false, error: "Razorpay keys missing from .env" }, { status: 500 });
    }

    const razorpay = new Razorpay({
       key_id: process.env.RAZORPAY_KEY_ID,
       key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let body: any = {};
    try {
       body = await req.json();
    } catch (e) {
       // Body is optional
    }

    const { vendorIds } = body;

    let whereClause: any = { status: "ELIGIBLE" };
    
    // If vendorIds array is provided, filter by those specific vendors
    if (vendorIds && Array.isArray(vendorIds) && vendorIds.length > 0) {
       whereClause.vendorId = { in: vendorIds };
    }

    // 1. Find all ELIGIBLE settlements
    const eligibleSettlements = await prisma.settlement.findMany({
       where: whereClause,
       include: {
          order: true
       }
    });

    if (eligibleSettlements.length === 0) {
       return NextResponse.json({ success: true, message: "No eligible settlements to process" });
    }

    // Fetch vendor users manually
    const settlementVendorIds = Array.from(new Set(eligibleSettlements.map(s => s.vendorId)));
    const vendors = await prisma.user.findMany({
       where: { id: { in: settlementVendorIds } }
    });
    const vendorMap = new Map(vendors.map(v => [v.id, v]));

    const processedIds: number[] = [];
    const failedIds: number[] = [];

    // 2. Process each settlement
    for (const settlement of eligibleSettlements) {
       const vendor = vendorMap.get(settlement.vendorId);
       if (!vendor) {
          console.warn(`Vendor not found for settlement ${settlement.id}`);
          failedIds.push(settlement.id);
          continue;
       }

       if (!vendor.razorpayAccountId) {
          console.warn(`Vendor ${vendor.id} has no Razorpay Linked Account`);
          failedIds.push(settlement.id);
          continue;
       }

       // Skip vendors whose payouts are paused
       if (vendor.payoutsPaused) {
          console.log(`Skipping payout for vendor ${vendor.id} because payouts are PAUSED.`);
          failedIds.push(settlement.id);
          continue;
       }

       try {
          // Razorpay Route Transfer API
          const transferPayload = {
             account: vendor.razorpayAccountId,
             amount: settlement.vendorPayoutPaise, // Amount to vendor
             currency: "INR",
             notes: {
                orderId: settlement.orderId,
                settlementId: String(settlement.id)
             }
          };

          // If standard payment is not used, this creates a direct transfer from the platform's balance to the linked account.
          // Note: In a production Razorpay Route setup, you can either transfer at time of payment (using transfers array in orders)
          // OR do a direct transfer later from the balance. We do it later.
          await razorpay.transfers.create(transferPayload);

          // Update DB Status
          await prisma.settlement.update({
             where: { id: settlement.id },
             data: { status: "SETTLED", settledAt: new Date() }
          });

          processedIds.push(settlement.id);
       } catch (err) {
          console.error(`Failed to transfer settlement ${settlement.id}:`, err);
          failedIds.push(settlement.id);
       }
    }

    return NextResponse.json({ 
       success: true, 
       message: `Payouts completed. Processed: ${processedIds.length}, Failed: ${failedIds.length}` 
    });

  } catch (error: any) {
    console.error("Payout API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
