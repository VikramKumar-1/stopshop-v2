import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;
    if (user.role !== "vendor" && !user.parentVendorId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const vendorId = user.role === "vendor" ? user.userId : user.parentVendorId;

    // Fetch return requests that belong to this vendor's items.
    // A return request might contain items from multiple vendors in theory,
    // but we can fetch requests where the linked order has items from this vendor.
    const returnRequests = await prisma.returnRequest.findMany({
      where: {
        order: {
          items: {
            some: {
              vendorId: vendorId
            }
          }
        }
      },
      include: {
        order: {
          include: {
            items: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Since a single order can have multiple items from multiple vendors,
    // we should filter the returnItems JSON to only include the items 
    // that belong to this specific vendor.
    const filteredReturns = returnRequests.map(ret => {
       // Filter the returnItems array
       let itemsToReturn = Array.isArray(ret.returnItems) ? ret.returnItems : [];
       
       // Map itemsToReturn to the actual OrderItems to check vendorId
       const myItems = itemsToReturn.filter((reqItem: any) => {
          const orderItem = ret.order.items.find(i => i.id === reqItem.orderItemId);
          return orderItem && orderItem.vendorId === vendorId;
       });

       return {
         ...ret,
         returnItems: myItems
       };
    }).filter(ret => ret.returnItems.length > 0); // Only keep requests that have items for this vendor

    const settings = await prisma.adminSettings.findFirst();
    const slaHours = settings?.vendorReturnSlaHours || 24;

    return NextResponse.json({ success: true, returns: filteredReturns, slaHours });

  } catch (error: any) {
    console.error("Vendor returns GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
