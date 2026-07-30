import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireRole(req, ["admin", "vendor"]);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Auto-heal orphaned vendor coupons created before vendorId fix
    if (user.role === "vendor") {
      await prisma.coupon.updateMany({
        where: { creatorRole: "VENDOR", vendorId: null },
        data: { vendorId: user.userId }
      });
    } else if (user.role === "admin") {
      const firstVendor = await prisma.user.findFirst({ where: { role: "vendor" } });
      if (firstVendor) {
        await prisma.coupon.updateMany({
          where: { creatorRole: "VENDOR", vendorId: null },
          data: { vendorId: firstVendor.id }
        });
      }
    }

    const whereClause = user.role === "vendor" ? { vendorId: (user as any).vendorId || user.userId } : {};

    const [coupons, totalCount] = await Promise.all([
      prisma.coupon.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.coupon.count({ where: whereClause })
    ]);

    return NextResponse.json({ success: true, coupons, totalCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireRole(req, ["admin", "vendor"]);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    let { 
      code, description, discountType, discountValue, maxDiscountPaise, 
      minOrderPaise, maxUses, maxUsesPerUser, startsAt, expiresAt, 
      applicableCategories, applicableMaterials, minItems, vendorId, isAutoApply,
      isFirstOrderOnly, allowDomestic, allowInternational
    } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: "Code and discountValue are required" }, { status: 400 });
    }

    code = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    let creatorRole = user.role.toUpperCase();
    let finalVendorId = vendorId ? parseInt(vendorId) : null;
    let vendorStatus = null;

    if (user.role === "vendor") {
      finalVendorId = (user as any).vendorId || user.userId;
      vendorStatus = "ACTIVE"; // Self-created
      
      // Enforce Vendor limits
      const val = parseFloat(discountValue);
      if (discountType === "PERCENTAGE" && val > 15) {
        return NextResponse.json({ error: "Vendors can offer a maximum of 15% discount" }, { status: 400 });
      }
      if (discountType === "FLAT" && val > 500) {
        return NextResponse.json({ error: "Vendors can offer a maximum of ₹500 flat discount" }, { status: 400 });
      }
    } else if (user.role === "admin" && finalVendorId) {
      vendorStatus = "PENDING_OPT_IN"; // Assigned by admin, vendor must approve
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        description,
        creatorRole,
        vendorId: finalVendorId,
        vendorStatus,
        discountType: discountType || "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        maxDiscountPaise: maxDiscountPaise ? parseInt(maxDiscountPaise) : null,
        minOrderPaise: minOrderPaise ? parseInt(minOrderPaise) : 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        maxUsesPerUser: maxUsesPerUser ? parseInt(maxUsesPerUser) : 1,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        applicableCategories,
        applicableMaterials,
        minItems: minItems ? parseInt(minItems) : 1,
        isActive: user.role === "admin" && finalVendorId ? false : true, // Active if not pending opt-in
        isAutoApply: user.role === "admin" ? !!isAutoApply : false, // ONLY Admin can set auto-apply
        isFirstOrderOnly: !!isFirstOrderOnly,
        allowDomestic: allowDomestic !== undefined ? !!allowDomestic : true,
        allowInternational: allowInternational !== undefined ? !!allowInternational : true
      }
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A coupon with this code already exists. Please use a unique code." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create coupon. Please try again." }, { status: 500 });
  }
}
