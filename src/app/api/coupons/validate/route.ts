import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { calculateOrderPricing } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    // Let's allow guest cart validation as well, but limit usage check to authenticated users
    
    const body = await req.json();
    const { code, cartItems, paymentMethod = "razorpay", country = "IN", isBundle } = body;

    if (!code || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Code and cartItems are required" }, { status: 400 });
    }

    const couponCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
    }

    const now = new Date();
    if (coupon.startsAt > now) {
      return NextResponse.json({ valid: false, error: "This coupon is not active yet" });
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    // Region restriction checks (silently reject mismatching region coupons as Invalid)
    const isDomestic = (country || "IN").toUpperCase() === "IN";
    if ((isDomestic && coupon.allowDomestic === false) || (!isDomestic && coupon.allowInternational === false)) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    // Check per-user limits and first order constraint
    if (user) {
      if (coupon.isFirstOrderOnly) {
        const totalSuccessfulOrders = await prisma.order.count({
          where: {
            userId: user.userId,
            status: { notIn: ["PENDING", "CANCELLED", "FAILED"] }
          }
        });
        if (totalSuccessfulOrders > 0) {
          return NextResponse.json({ valid: false, error: "This coupon is only valid for your first order" });
        }
      }

      if (coupon.maxUsesPerUser) {
        const userUses = await prisma.order.count({
          where: {
            userId: user.userId,
            couponCode: coupon.code,
            status: { notIn: ["PENDING", "CANCELLED", "FAILED"] }
          }
        });
        if (userUses >= coupon.maxUsesPerUser) {
          return NextResponse.json({ valid: false, error: "You have exceeded the usage limit for this coupon" });
        }
      }
    }

    // Let the pricing engine handle the vendor filtering and discount calculation
    const pricing = await calculateOrderPricing(cartItems, paymentMethod, country, coupon.code, isBundle, user?.userId);
    
    if (!pricing.couponCode) {
      return NextResponse.json({ valid: false, error: "Coupon is not applicable to any items in your cart, or does not meet the minimum order amount." });
    }

    return NextResponse.json({
      valid: true,
      discountPaise: pricing.discountPaise,
      couponCode: pricing.couponCode,
      message: `Coupon applied successfully! You saved ₹${pricing.discountPaise / 100}`
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message || "Failed to validate coupon" }, { status: 500 });
  }
}
