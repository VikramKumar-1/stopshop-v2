import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireRole(req, ["admin", "vendor"]);
    if (user instanceof NextResponse) return user;

    const couponId = parseInt(params.id);
    const body = await req.json();
    const { isActive, vendorStatus, isAutoApply, isFirstOrderOnly, description, expiresAt, maxUses, startsAt, applicableCategories, applicableMaterials } = body;

    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Security check
    if (user.role === "vendor") {
      if (coupon.vendorId !== (user as any).vendorId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (isAutoApply !== undefined) {
        return NextResponse.json({ error: "Vendors cannot modify auto-apply settings" }, { status: 403 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (description !== undefined) updateData.description = description;
    if (startsAt !== undefined) updateData.startsAt = startsAt ? new Date(startsAt) : new Date();
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (maxUses !== undefined) updateData.maxUses = maxUses ? parseInt(maxUses) : null;
    if (applicableCategories !== undefined) updateData.applicableCategories = applicableCategories;
    if (applicableMaterials !== undefined) updateData.applicableMaterials = applicableMaterials;
    
    // Vendor Opt-in logic
    if (user.role === "vendor" && vendorStatus !== undefined) {
      updateData.vendorStatus = vendorStatus;
      if (vendorStatus === "ACTIVE") updateData.isActive = true;
      if (vendorStatus === "REJECTED") updateData.isActive = false;
    }

    // Admin updates
    if (user.role === "admin") {
      if (isAutoApply !== undefined) updateData.isAutoApply = isAutoApply;
      if (isFirstOrderOnly !== undefined) updateData.isFirstOrderOnly = isFirstOrderOnly;
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData
    });

    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireRole(req, ["admin", "vendor"]);
    if (user instanceof NextResponse) return user;

    const couponId = parseInt(params.id);
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    if (user.role === "vendor" && coupon.vendorId !== (user as any).vendorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.coupon.delete({ where: { id: couponId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete coupon" }, { status: 500 });
  }
}
