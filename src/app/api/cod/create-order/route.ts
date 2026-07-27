import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { calculateOrderPricing } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const { cartItems, shippingInfo, couponCode } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    const countryNormalized = (shippingInfo.country || "IN").trim().toUpperCase();
    if (countryNormalized !== "IN" && countryNormalized !== "INDIA") {
      return NextResponse.json({ success: false, error: "COD is only available in India" }, { status: 400 });
    }

    // 1. Check if COD is enabled and get max limit
    const settings = await prisma.adminSettings.findFirst();
    if (!settings?.codEnabled) {
      return NextResponse.json({ success: false, error: "COD is currently disabled" }, { status: 400 });
    }

    // SECURITY: Graceful Lockdown Check
    if (settings?.lockdownMode) {
      return NextResponse.json({ 
        success: false, 
        error: "System is currently under maintenance. New checkouts are temporarily paused. Please try again in a few minutes." 
      }, { status: 503 });
    }

    // 2. Pricing
    const pricing = await calculateOrderPricing(cartItems, "cod", shippingInfo.country, couponCode);

    if (pricing.totalPaise > settings.codMaxAmountPaise) {
      return NextResponse.json({ 
        success: false, 
        error: `Order amount exceeds COD limit of ₹${settings.codMaxAmountPaise / 100}` 
      }, { status: 400 });
    }

    // 3. Create Order Atomically
    const newOrder = await prisma.$transaction(async (tx) => {
       // Deduct Stock
       for (const item of pricing.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product || product.stock < item.quantity) {
             throw new Error(`Out of stock for item ${item.productName}`);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
       }

       // Calculate Commission
       const commissionRate = settings.defaultCommissionRate || 10;
       const commissionPaise = Math.round(pricing.totalPaise * (commissionRate / 100));
       
       const dateStr = new Date().toISOString().slice(2,10).replace(/-/g,'');
       const randomToken = Math.floor(100000 + Math.random() * 900000);
       const orderNumber = `SS-COD-${dateStr}-${randomToken}`;

       const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.userId,
          paymentMethod: "cod",
          paymentStatus: "PENDING",
          status: "CONFIRMED", // COD is confirmed immediately
          subtotalPaise: pricing.subtotalPaise,
          shippingPaise: pricing.shippingPaise,
          codChargePaise: pricing.codChargePaise,
          taxPaise: pricing.taxPaise,
          discountPaise: pricing.discountPaise,
          couponCode: pricing.couponCode,
          totalPaise: pricing.totalPaise,
          commissionRate,
          commissionPaise,
          vendorPayoutPaise: pricing.totalPaise - commissionPaise,
          settlementStatus: "HOLD",
          
          shippingName: shippingInfo.name,
          shippingPhone: shippingInfo.phone,
          shippingEmail: shippingInfo.email || user.email,
          shippingAddress: shippingInfo.address,
          shippingCity: shippingInfo.city,
          shippingState: shippingInfo.state,
          shippingPincode: shippingInfo.pincode,
          shippingCountry: shippingInfo.country,
          
          items: {
            create: pricing.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPaise: item.unitPaise,
              totalPaise: item.totalPaise,
              productName: item.productName,
              productImage: item.productImage,
              productMaterial: item.productMaterial,
              vendorId: item.vendorId,
            }))
          }
        },
        include: { items: true }
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

      return order;
    }, { maxWait: 10000, timeout: 30000 });

    // Order confirmed; wait for vendor packing before creating Shiprocket shipment

    return NextResponse.json({
      success: true,
      dbOrderId: newOrder.id,
      orderNumber: newOrder.orderNumber
    });
  } catch (error: any) {
    console.error("COD create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
