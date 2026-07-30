import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const rawLimit = parseInt(searchParams.get("limit") || "15");
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const status = searchParams.get("status");

    let whereClause: any = {};

    const asVendor = searchParams.get("vendorId");
    const effUserId = Number(user.id || user.userId);
    const currentVendorId = user.role === "vendor" ? effUserId : (user.parentVendorId ? Number(user.parentVendorId) : null);

    const targetVendorId = asVendor ? Number(asVendor) : null;

    if (user.role === "admin") {
      if (targetVendorId) {
        whereClause.items = { some: { vendorId: targetVendorId } };
      }
    } else if (user.role === "vendor" || currentVendorId) {
      const vId = targetVendorId || currentVendorId;
      if (vId) {
        whereClause.items = {
          some: { vendorId: vId }
        };
      }
      if (status) {
        whereClause.status = status === "PENDING" ? { not: "PENDING" } : status;
      } else {
        whereClause.status = { not: "PENDING" };
      }
    } else {
      whereClause.userId = effUserId;
      if (!status) {
        whereClause.status = { not: "PENDING" };
      }
    }

    if (status && user.role !== "vendor" && user.role !== "admin") {
       whereClause.status = status;
    }

    const shouldFetchStats = searchParams.get("getStats") === "true";

    const [total, orders, stats] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.findMany({
        where: whereClause,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          totalPaise: true,
          shippingName: true,
          shippingCity: true,
          shippingState: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddress: true,
          shippingPincode: true,
          shippingCountry: true,
          createdAt: true,
          updatedAt: true,
          awbCode: true,
          courierName: true,
          returnAwbCode: true,
          returnCourierName: true,
          shippingLabelUrl: true,
          deliveryDate: true,
          deliveredAt: true,
          trackingId: true,
          paymentGateway: true,
          razorpayPaymentId: true,
          subtotalPaise: true,
          shippingPaise: true,
          codChargePaise: true,
          taxPaise: true,
          discountPaise: true,
          couponCode: true,
          commissionPaise: true,
          vendorPayoutPaise: true,
          user: {
            select: { id: true, name: true, email: true, mobile: true }
          },
          items: true,
          returnRequest: true
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      shouldFetchStats ? prisma.order.findMany({
        where: whereClause,
        select: {
           status: true,
           paymentGateway: true,
           paymentStatus: true,
           totalPaise: true,
           commissionPaise: true,
           vendorPayoutPaise: true
        }
      }) : Promise.resolve(undefined)
    ]);

    return NextResponse.json({
      success: true,
      orders,
      stats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
