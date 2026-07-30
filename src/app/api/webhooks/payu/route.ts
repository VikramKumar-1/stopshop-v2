import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { PAYU_CONFIG } from "@/lib/paymentConfig";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const { txnid, amount, productinfo, firstname, email, status, hash, mihpayid } = data;

    if (!txnid || !hash || !status) {
       return NextResponse.json({ success: false, error: "Missing webhook parameters" }, { status: 400 });
    }

    // Verify Hash (Reverse order: SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key)
    const hashString = `${PAYU_CONFIG.merchantSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.merchantKey}`;
    const generatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    if (generatedHash !== hash) {
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    if (status === "success") {
       await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { paymentOrderId: txnid },
          include: { items: true }
        });

        if (order && order.status === "PENDING" && order.paymentStatus === "PENDING") {
           // Acquire lock
           const lock = await tx.order.updateMany({
              where: { id: order.id, paymentStatus: "PENDING" },
              data: { paymentStatus: "PROCESSING" }
           });
           if (lock.count === 0) return; // Processed concurrently

           // Verify amount matches roughly (amount from PayU is string "499.00")
           const paidPaise = Math.round(parseFloat(amount) * 100);
           if (Math.abs(order.totalPaise - paidPaise) <= 100) { // allow 1 rupee diff due to float
              for (const item of order.items) {
                await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: { decrement: item.quantity } }
                });
              }

              const settings = await tx.adminSettings.findFirst();
              const commissionRate = settings?.defaultCommissionRate || 10;
              const commissionPaise = Math.round(order.totalPaise * (commissionRate / 100));
              
              await tx.order.update({
                where: { id: order.id },
                data: {
                  paymentStatus: "PAID",
                  status: "CONFIRMED",
                  razorpayPaymentId: mihpayid,
                  paymentData: data,
                  commissionRate,
                  commissionPaise,
                  vendorPayoutPaise: order.totalPaise - commissionPaise,
                  settlementStatus: "HOLD",
                }
              });

              // Create Settlements
              const vendorTotals: Record<number, number> = {};
              for (const item of order.items) {
                if (item.vendorId) {
                  vendorTotals[item.vendorId] = (vendorTotals[item.vendorId] || 0) + item.totalPaise;
                }
              }

              for (const [vendorId, total] of Object.entries(vendorTotals)) {
                const vComm = Math.round(total * (commissionRate / 100));
                await tx.settlement.create({
                  data: {
                    orderId: order.id,
                    vendorId: Number(vendorId),
                    orderAmountPaise: total,
                    commissionPaise: vComm,
                    vendorPayoutPaise: total - vComm,
                    status: "HOLD",
                    holdUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  }
                });
              }
           }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayU webhook error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
