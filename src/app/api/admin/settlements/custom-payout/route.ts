import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    const { vendorId, productId, amountPaise, notes, testMode, settlementId } = body;

    let settlement = null;
    if (settlementId) {
      settlement = await prisma.settlement.findUnique({
        where: { id: parseInt(settlementId) },
        include: { order: true }
      });
      if (!settlement) {
        return NextResponse.json({ success: false, error: "Settlement not found" }, { status: 404 });
      }
      if (settlement.status === "SETTLED") {
        return NextResponse.json({ success: false, error: "Settlement is already settled" }, { status: 400 });
      }
    }

    if (!vendorId || !amountPaise || amountPaise <= 0) {
      return NextResponse.json({ success: false, error: "Invalid vendor or amount" }, { status: 400 });
    }

    let vendor = await prisma.user.findUnique({ where: { id: parseInt(vendorId) } });
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }

    if (!testMode) {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json({ success: false, error: "Razorpay keys missing from .env" }, { status: 500 });
      }

      if (!vendor.razorpayAccountId) {
        return NextResponse.json({ success: false, error: "Vendor does not have a linked Razorpay account" }, { status: 400 });
      }
    }

    let transferId = "mock_trf_custom_" + Math.random().toString(36).substring(2, 11).toUpperCase();

    if (!testMode) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      try {
        const transferPayload = {
          account: vendor.razorpayAccountId!,
          amount: parseInt(amountPaise),
          currency: "INR",
          notes: {
            type: "custom_payout",
            vendorId: String(vendorId),
            productId: productId ? String(productId) : "N/A",
            adminNotes: notes || ""
          }
        };

        const transfer = await razorpay.transfers.create(transferPayload);
        transferId = transfer.id;
      } catch (error: any) {
        console.error("Razorpay transfer failed:", error);
        return NextResponse.json({ success: false, error: error.description || error.message || "Razorpay transfer failed" }, { status: 400 });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const customPayout = await tx.customPayout.create({
        data: {
          vendorId: parseInt(vendorId),
          productId: productId ? parseInt(productId) : null,
          amountPaise: parseInt(amountPaise),
          notes: notes || null,
          status: testMode ? "COMPLETED" : "PROCESSING",
          paymentRef: transferId,
        }
      });

      if (settlement) {
        const amtPaise = parseInt(amountPaise);
        const diffPaise = settlement.vendorPayoutPaise - amtPaise;

        // Update settlement status and values
        await tx.settlement.update({
          where: { id: settlement.id },
          data: {
            status: testMode ? "SETTLED" : "PROCESSING",
            vendorPayoutPaise: amtPaise,
            commissionPaise: settlement.orderAmountPaise - amtPaise,
            vendorPaymentRef: transferId,
            vendorPaymentMode: testMode ? "razorpay_route_mock" : "razorpay_route",
            settledAt: new Date(),
          }
        });

        // Update corresponding Order totals (commission & vendor share)
        await tx.order.update({
          where: { id: settlement.orderId },
          data: {
            vendorPayoutPaise: { decrement: diffPaise },
            commissionPaise: { increment: diffPaise },
          }
        });

        // Determine if overall order settlementStatus should be updated
        const otherSettlements = await tx.settlement.findMany({
          where: { orderId: settlement.orderId, id: { not: settlement.id } }
        });
        
        const targetStatus = testMode ? "SETTLED" : "PROCESSING";
        const allowedStatuses = testMode ? ["SETTLED", "CANCELLED"] : ["SETTLED", "PROCESSING", "CANCELLED"];
        if (otherSettlements.every(os => allowedStatuses.includes(os.status))) {
          await tx.order.update({
            where: { id: settlement.orderId },
            data: { settlementStatus: targetStatus }
          });
        }
      }

      return customPayout;
    }, { maxWait: 10000, timeout: 30000 });

    return NextResponse.json({ success: true, data: result, message: "Custom payout processed successfully" });

  } catch (error: any) {
    console.error("Custom payout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
