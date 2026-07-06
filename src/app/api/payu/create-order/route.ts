import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { calculateOrderPricing } from "@/lib/pricing";
import { PAYU_CONFIG, isPayUConfigured } from "@/lib/paymentConfig";


export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    if (!isPayUConfigured()) {
      return NextResponse.json({ success: false, error: "PayU is not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { cartItems, shippingInfo, couponCode, isBundle } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // 1. Server-side pricing calculation
    const pricing = await calculateOrderPricing(cartItems, "payu", shippingInfo.country, couponCode, isBundle, user.userId);

    // 2. Create Order in Database
    const orderNumber = `SS-INTL-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txnid = `txnid_${Date.now()}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        paymentMethod: "payu",
        paymentGateway: "payu",
        paymentStatus: "PENDING",
        paymentOrderId: txnid,
        subtotalPaise: pricing.subtotalPaise,
        shippingPaise: pricing.shippingPaise,
        codChargePaise: pricing.codChargePaise,
        taxPaise: pricing.taxPaise,
        discountPaise: pricing.discountPaise,
        couponCode: pricing.couponCode,
        totalPaise: pricing.totalPaise,
        
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
      }
    });

    // 3. Generate PayU Hash
    // Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const amount = (pricing.totalPaise / 100).toFixed(2);
    const productInfo = "StopShops Order";
    const firstName = shippingInfo.name.split(" ")[0] || "Customer";
    const email = shippingInfo.email || user.email;

    const hashString = `${PAYU_CONFIG.merchantKey}|${txnid}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${PAYU_CONFIG.merchantSalt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // 4. Return PayU Form Data
    return NextResponse.json({
      success: true,
      payuData: {
        key: PAYU_CONFIG.merchantKey,
        txnid,
        amount,
        productinfo: productInfo,
        firstname: firstName,
        email,
        phone: shippingInfo.phone,
        surl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payu/callback`,
        furl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payu/callback`,
        hash,
        action: `${PAYU_CONFIG.baseUrl}/_payment`,
      },
      dbOrderId: newOrder.id
    });
  } catch (error: any) {
    console.error("PayU create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
