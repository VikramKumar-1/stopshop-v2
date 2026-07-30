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

    // Fetch return requests + admin settings in parallel
    const [returnRequests, settings] = await Promise.all([
      prisma.returnRequest.findMany({
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
            select: {
              id: true,
              orderNumber: true,
              status: true,
              items: {
                select: {
                  id: true,
                  productId: true,
                  vendorId: true,
                  productName: true,
                  productImage: true,
                  quantity: true,
                  unitPaise: true,
                  totalPaise: true,
                  returnQuantity: true,
                  returnStatus: true,
                  productMaterial: true,
                  dispatchImages: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.adminSettings.findFirst({ select: { vendorReturnSlaHours: true } })
    ]);

    // Since a single order can have multiple items from multiple vendors,
    // we should filter the returnItems JSON to only include the items 
    // that belong to this specific vendor.
    const filteredReturns = returnRequests.map(ret => {
       // Filter the returnItems array
       let itemsToReturn = Array.isArray(ret.returnItems) ? ret.returnItems : [];
       
       // Map itemsToReturn to the actual OrderItems to check vendorId
       let myItems = itemsToReturn.filter((reqItem: any) => {
          const orderItem = ret.order.items.find(i => 
            i.id === reqItem.orderItemId || 
            i.productId === reqItem.productId || 
            i.productId === reqItem.id ||
            i.id === reqItem.id
          );
          return orderItem && orderItem.vendorId === vendorId;
       });

       // Fallback: If returnItems JSON doesn't directly map IDs, check if order items belong to vendor
       if (myItems.length === 0) {
          const vendorOrderItems = ret.order.items.filter(i => i.vendorId === vendorId);
          if (vendorOrderItems.length > 0) {
             myItems = vendorOrderItems;
          }
       }

       return {
         ...ret,
         returnItems: myItems
       };
    }).filter(ret => ret.returnItems.length > 0); // Only keep requests that have items for this vendor

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
