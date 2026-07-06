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
      return NextResponse.redirect(new URL("/checkout/failure?reason=missing_data", req.url));
    }

    // 1. Verify Hash (Reverse order: SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key)
    const hashString = `${PAYU_CONFIG.merchantSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.merchantKey}`;
    const generatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    if (generatedHash !== hash) {
      console.error("PayU Hash Mismatch", { expected: generatedHash, received: hash });
      return NextResponse.redirect(new URL("/checkout/failure?reason=invalid_signature", req.url));
    }

    if (status !== "success") {
      await prisma.order.update({
        where: { paymentOrderId: txnid },
        data: { paymentStatus: "FAILED", paymentData: data }
      });
      return NextResponse.redirect(new URL(`/checkout/failure?reason=${data.error_Message || 'payment_failed'}`, req.url));
    }

    // 2. Process Successful Payment (Atomic transaction)
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { paymentOrderId: txnid },
        include: { items: true }
      });

      if (!order) throw new Error("Order not found");
      if (order.status !== "PENDING" && order.paymentStatus === "PAID") return; // Already processed

      // Deduct Stock and Track Co-Purchases
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
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
    });

    let dbOrderId = null;
    const order = await prisma.order.findUnique({ where: { paymentOrderId: txnid } });
    if (order) {
       dbOrderId = order.id;
       // Order confirmed; wait for vendor packing before creating Shiprocket shipment
    }

    return NextResponse.redirect(new URL(`/checkout/success${dbOrderId ? `?orderId=${dbOrderId}` : ''}`, req.url));
  } catch (error) {
    console.error("PayU callback error:", error);
    return NextResponse.redirect(new URL("/checkout/failure?reason=internal_error", req.url));
  }
}
