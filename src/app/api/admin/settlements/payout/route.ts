import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    let body: any = {};
    try {
       body = await req.json();
    } catch (e) {
       // Body is optional
    }

    const { vendorIds, payoutType, vendorPaymentRef, testMode } = body;

    let razorpay: any = null;
    if (!testMode) {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
         return NextResponse.json({ success: false, error: "Razorpay keys missing from .env" }, { status: 500 });
      }

      razorpay = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID,
         key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }

    let whereClause: any = { status: "ELIGIBLE" };
    
    // If vendorIds array is provided, filter by those specific vendors
    if (vendorIds && Array.isArray(vendorIds) && vendorIds.length > 0) {
       whereClause.vendorId = { in: vendorIds };
    }

    if (payoutType === "prepaid") {
       whereClause.order = { paymentMethod: { in: ["razorpay", "payu"] } };
    } else if (payoutType === "cod") {
       whereClause.order = { paymentMethod: "cod" };
    } else {
       return NextResponse.json({ success: false, error: "Invalid payoutType" }, { status: 400 });
    }

    // 1. Find all ELIGIBLE settlements
    const eligibleSettlements = await prisma.settlement.findMany({
       where: whereClause,
       include: {
          order: true
       }
    });

    if (eligibleSettlements.length === 0) {
       return NextResponse.json({ success: true, message: `No eligible ${payoutType} settlements to process` });
    }

    // Fetch vendor users manually
    const settlementVendorIds = Array.from(new Set(eligibleSettlements.map(s => s.vendorId)));
    const vendors = await prisma.user.findMany({
       where: { id: { in: settlementVendorIds } }
    });
    const vendorMap = new Map(vendors.map(v => [v.id, v]));

    // Fast-path for Test Payout Mode (Bulk update in 10ms)
    if (testMode) {
       const validSettlements = eligibleSettlements.filter(s => {
          const v = vendorMap.get(s.vendorId);
          return v && !v.payoutsPaused;
       });

       const validIds = validSettlements.map(s => s.id);
       const targetOrderIds = Array.from(new Set(validSettlements.map(s => s.orderId)));

       if (validIds.length > 0) {
          await Promise.all([
             prisma.settlement.updateMany({
                where: { id: { in: validIds } },
                data: {
                   status: "SETTLED",
                   vendorPaymentMode: "razorpay_route_mock",
                   vendorPaymentRef: "mock_trf_bulk_" + Date.now(),
                   settledAt: new Date()
                }
             }),
             prisma.order.updateMany({
                where: { id: { in: targetOrderIds } },
                data: { settlementStatus: "SETTLED" }
             })
          ]);
       }

       return NextResponse.json({
          success: true,
          message: `Test Payouts completed instantly for ${validIds.length} settlements!`,
          processedCount: validIds.length
       });
    }

    const processedIds: number[] = [];
    const failedIds: number[] = [];

    // 2. Process each live settlement
    for (const settlement of eligibleSettlements) {
       const vendor = vendorMap.get(settlement.vendorId);
       if (!vendor) {
          console.warn(`Vendor not found for settlement ${settlement.id}`);
          failedIds.push(settlement.id);
          continue;
       }

       // Skip vendors whose payouts are paused
       if (vendor.payoutsPaused) {
          console.log(`Skipping payout for vendor ${vendor.id} because payouts are PAUSED.`);
          failedIds.push(settlement.id);
          continue;
       }

       if (payoutType === "prepaid" || payoutType === "cod") {
          if (!testMode && !vendor.razorpayAccountId) {
             console.warn(`Vendor ${vendor.id} has no Razorpay Linked Account`);
             failedIds.push(settlement.id);
             continue;
          }

          try {
             let transferId = "mock_trf_" + Math.random().toString(36).substring(2, 11).toUpperCase();

             if (!testMode && razorpay) {
                // Razorpay Route Transfer API
                const transferPayload = {
                   account: vendor.razorpayAccountId!,
                   amount: settlement.vendorPayoutPaise, // Amount to vendor
                   currency: "INR",
                   notes: {
                      orderId: settlement.orderId,
                      settlementId: String(settlement.id)
                   }
                };

                const transfer = await razorpay.transfers.create(transferPayload);
                transferId = transfer.id;
             }

             // Update DB Status to SETTLED if testMode, or PROCESSING if live (live webhook will update to SETTLED)
             await prisma.settlement.update({
                where: { id: settlement.id },
                data: { 
                   status: testMode ? "SETTLED" : "PROCESSING", 
                   vendorPaymentMode: testMode ? "razorpay_route_mock" : "razorpay_route", 
                   vendorPaymentRef: transferId,
                   settledAt: testMode ? new Date() : null
                }
             });

             processedIds.push(settlement.id);
          } catch (err: any) {
             console.error(`Failed to transfer settlement ${settlement.id}:`, err);
             // Fail fast if insufficient balance
             if (err?.error?.description?.includes("balance")) {
                throw new Error("Insufficient Razorpay Balance");
             }
             failedIds.push(settlement.id);
          }
       }
    }

    // Mark orders as PROCESSING or SETTLED if all their settlements are done
    for (const settlement of eligibleSettlements) {
       if (processedIds.includes(settlement.id)) {
          const otherSettlements = await prisma.settlement.findMany({
             where: { orderId: settlement.orderId }
          });
          const targetStatus = testMode ? "SETTLED" : "PROCESSING";
          const allowedStatuses = testMode ? ["SETTLED", "CANCELLED"] : ["SETTLED", "PROCESSING", "CANCELLED"];
          if (otherSettlements.every(os => allowedStatuses.includes(os.status))) {
             await prisma.order.update({
                where: { id: settlement.orderId },
                data: { settlementStatus: targetStatus }
             });
          }
       }
    }

    return NextResponse.json({ 
       success: true, 
       message: `${testMode ? "Test " : ""}Payouts completed. Processed: ${processedIds.length}, Failed: ${failedIds.length}` 
    });

  } catch (error: any) {
    console.error("Payout API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
