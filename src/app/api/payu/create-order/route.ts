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

    const userId = user.id || user.userId;

    // 1. Server-side pricing calculation
    const pricing = await calculateOrderPricing(cartItems, "payu", shippingInfo.country, couponCode, isBundle, userId);

    // 2. Create Order in Database (Enterprise International Format)
    const dateStr = new Date().toISOString().slice(2,10).replace(/-/g,'');
    const randomToken = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `SS-INTL-${dateStr}-${randomToken}`;
    const txnid = `txnid_${Date.now()}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId,
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

    // 3. Dynamic Origin Resolution for Callbacks (Avoids localhost fallback on Vercel)
    const origin = req.headers.get("origin") || req.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || "https://stopshops.com";
    const cleanOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;
    const surl = `${cleanOrigin}/api/payu/callback`;
    const furl = `${cleanOrigin}/api/payu/callback`;

    // 4. Generate PayU Hash
    // Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const amount = (pricing.totalPaise / 100).toFixed(2);
    const productInfo = "StopShops Order";
    const firstName = (shippingInfo.name || "Customer").split(" ")[0].trim();
    const email = shippingInfo.email || user.email || "customer@stopshops.com";

    const hashString = `${PAYU_CONFIG.merchantKey}|${txnid}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${PAYU_CONFIG.merchantSalt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // 5. Return PayU Form Data
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
        surl,
        furl,
        hash,
        action: `${PAYU_CONFIG.baseUrl}/_payment`,
      },
      dbOrderId: newOrder.id
    });
  } catch (error: any) {
    console.error("PayU create order error:", error);
    let errorMessage = error.message || "Internal server error";
    if (errorMessage.includes("Can't reach database server") || errorMessage.includes("prisma.")) {
       errorMessage = "We are currently experiencing a temporary database issue. Please try again in a few moments.";
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
