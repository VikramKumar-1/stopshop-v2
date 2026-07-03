import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const body = await req.json();
    const { cartItems } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: true, coupons: [] }); // No items, no coupons
    }

    // Get unique vendor IDs from cart items
    // First fetch the products to know their vendors
    const productIds = cartItems.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, vendorId: true }
    });

    const vendorIds = Array.from(new Set(products.map(p => p.vendorId).filter((id): id is number => id !== null)));

    // Fetch active coupons
    const now = new Date();
    const activeCoupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: now } }
            ]
          },
          {
            OR: [
              { vendorId: null },
              { vendorId: { in: vendorIds } }
            ]
          }
        ]
      }
    });

    // Filter out coupons that the user has already maxed out
    const availableCoupons = [];
    
    for (const coupon of activeCoupons) {
      // Skip if global usage limit reached
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) continue;
      
      let userEligible = true;
      if (user && coupon.maxUsesPerUser) {
        const userUses = await prisma.order.count({
          where: {
            userId: user.userId,
            couponCode: coupon.code,
            status: { notIn: ["PENDING", "CANCELLED", "FAILED"] }
          }
        });
        if (userUses >= coupon.maxUsesPerUser) {
          userEligible = false;
        }
      }
      
      if (userEligible) {
        availableCoupons.push({
          code: coupon.code,
          description: coupon.description || (coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`),
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderPaise: coupon.minOrderPaise,
          isAutoApply: coupon.isAutoApply
        });
      }
    }

    return NextResponse.json({ success: true, coupons: availableCoupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch available coupons" }, { status: 500 });
  }
}
