import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";
import { requireAuth } from "@/lib/auth";
import { calculateOrderPricing } from "@/lib/pricing";
import { RAZORPAY_CONFIG, isRazorpayConfigured } from "@/lib/paymentConfig";


export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    if (!isRazorpayConfigured()) {
      return NextResponse.json({ success: false, error: "Razorpay is not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { cartItems, shippingInfo } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // 1. Server-side pricing calculation (ignores any client prices)
    const pricing = await calculateOrderPricing(cartItems, "razorpay", shippingInfo.country);

    // 2. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: RAZORPAY_CONFIG.keyId,
      key_secret: RAZORPAY_CONFIG.keySecret,
    });

    // 3. Create order in Razorpay
    const options = {
      amount: pricing.totalPaise,
      currency: "INR",
      receipt: `SS_${Date.now()}_${user.userId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return NextResponse.json({ success: false, error: "Failed to create Razorpay order" }, { status: 500 });
    }

    // 4. Create Order in Database
    const orderNumber = `SS-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        paymentMethod: "razorpay",
        paymentGateway: "razorpay",
        paymentStatus: "PENDING",
        paymentOrderId: razorpayOrder.id,
        subtotalPaise: pricing.subtotalPaise,
        shippingPaise: pricing.shippingPaise,
        codChargePaise: pricing.codChargePaise,
        taxPaise: pricing.taxPaise,
        totalPaise: pricing.totalPaise,
        
        // Shipping Info
        shippingName: shippingInfo.name,
        shippingPhone: shippingInfo.phone,
        shippingEmail: shippingInfo.email || user.email,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingPincode: shippingInfo.pincode,
        shippingCountry: shippingInfo.country || "IN",
        
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

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder.id
    });
  } catch (error: any) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
