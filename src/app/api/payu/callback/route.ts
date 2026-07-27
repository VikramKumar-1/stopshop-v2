import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { PAYU_CONFIG } from "@/lib/paymentConfig";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const { txnid, amount, productinfo, firstname, email, status, hash, mihpayid, additionalCharges } = data;

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = host ? `${proto}://${host}` : req.nextUrl.origin;
    const cleanOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;

    if (!txnid || !hash || !status) {
      return NextResponse.redirect(`${cleanOrigin}/checkout/failure?reason=missing_data`, 303);
    }

    // 1. Verify Hash (Reverse order: SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key)
    let hashString = `${PAYU_CONFIG.merchantSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.merchantKey}`;
    if (additionalCharges) {
      hashString = `${additionalCharges}|${hashString}`;
    }
    const generatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    if (generatedHash !== hash) {
      console.error("PayU Hash Mismatch", { expected: generatedHash, received: hash });
      return NextResponse.redirect(`${cleanOrigin}/checkout/failure?reason=invalid_signature`, 303);
    }

    if (status !== "success") {
      await prisma.order.update({
        where: { paymentOrderId: txnid },
        data: { paymentStatus: "FAILED", paymentData: data }
      });
      return NextResponse.redirect(`${cleanOrigin}/checkout/failure?reason=${encodeURIComponent(data.error_Message || "payment_failed")}`, 303);
    }

    // 2. Process Successful Payment (Atomic transaction with 30s timeout)
    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { paymentOrderId: txnid },
          include: { items: true }
        });

        if (!order) throw new Error("Order not found");
        if (order.status !== "PENDING" && order.paymentStatus === "PAID") return; // Already processed

        // Deduct Stock (Atomic Concurrency Safe)
        for (const item of order.items) {
          const updateResult = await tx.product.updateMany({
            where: { 
               id: item.productId,
               stock: { gte: item.quantity }
            },
            data: { stock: { decrement: item.quantity } }
          });
          
          if (updateResult.count === 0) {
             throw new Error(`OUT_OF_STOCK_ERROR: Someone just bought the last stock of ${item.productName}.`);
          }
        }

        // Track 'Frequently Bought Together' pairs
        if (order.items.length > 1) {
          for (let i = 0; i < order.items.length; i++) {
            for (let j = i + 1; j < order.items.length; j++) {
              const pA = Math.min(order.items[i].productId, order.items[j].productId);
              const pB = Math.max(order.items[i].productId, order.items[j].productId);
              
              await tx.productPair.upsert({
                where: { productA_productB: { productA: pA, productB: pB } },
                update: { score: { increment: 1 } },
                create: { productA: pA, productB: pB, score: 1 }
              });
            }
          }
        }

        // Calculate Commission
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
              holdUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          });
        }
      }, { maxWait: 10000, timeout: 30000 });
    } catch (txError: any) {
      if (txError.message && txError.message.includes("OUT_OF_STOCK_ERROR")) {
         console.warn("PayU Out of stock race condition caught. Auto-refunding.");
         try {
            const { processPayURefund } = await import("@/lib/payu");
            const failedOrder = await prisma.order.findUnique({ where: { paymentOrderId: txnid } });
            if (failedOrder) {
               await processPayURefund(mihpayid, failedOrder.totalPaise);
               await prisma.order.update({
                  where: { id: failedOrder.id },
                  data: {
                     status: "CANCELLED_OUT_OF_STOCK",
                     paymentStatus: "REFUNDED",
                     razorpayPaymentId: mihpayid
                  }
               });
            }
         } catch (refundErr) {
            console.error("Failed to auto-refund out-of-stock order (PayU):", refundErr);
         }
         return NextResponse.redirect(`${cleanOrigin}/checkout/failure?reason=out_of_stock_refunded`, 303);
      }
      throw txError;
    }

    let dbOrderId = null;
    const order = await prisma.order.findUnique({ where: { paymentOrderId: txnid } });
    if (order) {
       dbOrderId = order.id;
    }

    const redirectTarget = dbOrderId 
      ? `${cleanOrigin}/checkout/success?orderId=${dbOrderId}`
      : `${cleanOrigin}/checkout/success`;

    return NextResponse.redirect(redirectTarget, 303);
  } catch (error) {
    console.error("PayU callback error:", error);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = host ? `${proto}://${host}` : req.nextUrl.origin;
    const cleanOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;
    return NextResponse.redirect(`${cleanOrigin}/checkout/failure?reason=internal_error`, 303);
  }
}

