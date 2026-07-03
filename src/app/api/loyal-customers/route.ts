import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "vendor" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Fetch all successful order items for this vendor
    const items = await prisma.orderItem.findMany({
      where: {
        vendorId: session.userId,
        order: {
          status: { notIn: ["CANCELLED", "RETURNED", "RETURN_REQUESTED"] }
        }
      },
      include: {
        order: {
          select: {
            userId: true,
            user: { select: { name: true, email: true } },
            id: true
          }
        },
        product: {
          select: { name: true, image: true, categoryName: true, price: true, mrp: true }
        }
      }
    });

    // Group by user
    const customersMap = new Map();

    for (const item of items) {
      const user = item.order?.user;
      if (!user) continue;

      if (!customersMap.has(item.order.userId)) {
        customersMap.set(item.order.userId, {
          userId: item.order.userId,
          name: user.name || "Customer",
          email: user.email || "",
          totalSpentPaise: 0,
          uniqueOrderIds: new Set(),
          productsMap: new Map() // to track unique products bought
        });
      }

      const c = customersMap.get(item.order.userId);
      c.totalSpentPaise += item.totalPaise;
      c.uniqueOrderIds.add(item.order.id);
      
      if (item.product && !c.productsMap.has(item.productId)) {
        c.productsMap.set(item.productId, {
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          mrp: item.product.mrp
        });
      }
    }

    // Map to array, calculate total orders, filter and sort
    const allLoyalCustomers = Array.from(customersMap.values())
      .map(c => ({
        userId: c.userId,
        name: c.name,
        email: c.email,
        totalOrders: c.uniqueOrderIds.size,
        totalSpent: c.totalSpentPaise / 100, // convert paise to INR
        products: Array.from(c.productsMap.values())
      }))
      .filter(c => c.totalOrders >= 2)
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Fetch active offers for these users from this vendor to exclude them
    const activeOffers = await prisma.targetedOffer.findMany({
      where: {
        vendorId: session.userId,
        userId: { in: allLoyalCustomers.map(c => c.userId) },
        isActive: true,
        expiresAt: { gt: new Date() }
      }
    });

    const usersWithActiveOffers = new Set(activeOffers.map(o => o.userId));
    const filteredLoyalCustomers = allLoyalCustomers.filter(c => !usersWithActiveOffers.has(c.userId));

    const total = filteredLoyalCustomers.length;
    const paginatedCustomers = filteredLoyalCustomers.slice(skip, skip + limit);

    return NextResponse.json({ 
      success: true, 
      customers: paginatedCustomers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error("Error fetching loyal customers:", error);
    return NextResponse.json({ error: "Failed to fetch loyal customers" }, { status: 500 });
  }
}
