import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, requireAuth } from "@/lib/auth";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { 
         items: true,
         returnRequest: true,
         settlements: user.role === "admin" || user.role === "vendor" ? true : false
      }
    });

    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (user.role === "user" && order.userId !== user.userId) {
       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (user.role === "vendor") {
       const isBuyer = order.userId === user.userId;
       const isSeller = order.items.some((item: any) => item.vendorId === user.userId);
       if (!isBuyer && !isSeller) {
          return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
       }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireRole(req, ["admin", "vendor"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    const { status, deliveryDate } = body;

    if (!status) {
       return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const updates: any = { status };

    if (deliveryDate !== undefined) {
       updates.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    }

    if (status === "DELIVERED" && order.status !== "DELIVERED") {
       updates.deliveredAt = new Date();
    }

    const updated = await prisma.order.update({
       where: { id: order.id },
       data: updates
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
