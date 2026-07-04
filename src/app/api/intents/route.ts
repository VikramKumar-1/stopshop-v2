import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, vendorId, type } = body;

    if (!productId || !type || !vendorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pIdNum = parseInt(productId);
    if (isNaN(pIdNum)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: pIdNum },
      select: { vendorId: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const actualVendorId = product.vendorId;
    if (!actualVendorId) {
      return NextResponse.json({ error: "Product has no vendor" }, { status: 400 });
    }

    // Upsert intent
    const intent = await prisma.userIntent.upsert({
      where: {
        userId_productId_type: {
          userId: session.userId,
          productId: pIdNum,
          type: type.toUpperCase()
        }
      },
      update: {
        vendorId: actualVendorId, // Fix incorrect vendorIds from frontend cache
        hasPurchased: false,
        isDismissed: false, // Reset so it can be targeted again if they re-add
        updatedAt: new Date()
      },
      create: {
        userId: session.userId,
        productId: pIdNum,
        vendorId: actualVendorId,
        type: type.toUpperCase(),
        hasPurchased: false
      }
    });

    return NextResponse.json({ success: true, intent });
  } catch (error: any) {
    console.error("Error saving user intent:", error);
    return NextResponse.json({ error: "Failed to log intent" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "vendor" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // 3-hour cooling off & 7-day auto-expiry logic
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Opportunistic cleanup of very old intents (fire and forget)
    prisma.userIntent.deleteMany({
      where: { updatedAt: { lt: thirtyDaysAgo } }
    }).catch(console.error);

    const whereClause: any = {
      hasPurchased: false,
      isDismissed: false,
      updatedAt: {
        lt: threeHoursAgo, // 3-hour delay
        gt: sevenDaysAgo
      }
    };

    if (session.role === "vendor") {
      whereClause.vendorId = session.userId;
    }

    const allIntents = await prisma.userIntent.findMany({
      where: whereClause,
      include: {
        product: { select: { id: true, name: true, price: true, image: true, categoryName: true } },
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { updatedAt: "desc" }
    });

    // Group by User
    const groupedMap = new Map();
    for (const intent of allIntents) {
      if (!intent.user) continue;
      if (!groupedMap.has(intent.userId)) {
        groupedMap.set(intent.userId, {
          userId: intent.userId,
          user: intent.user,
          vendorId: intent.vendorId,
          updatedAt: intent.updatedAt, // Most recent interaction
          type: intent.type, // Mostly "CART"
          intentIds: [],
          products: []
        });
      }
      const group = groupedMap.get(intent.userId);
      group.intentIds.push(intent.id);
      group.products.push({ ...intent.product, type: intent.type });
      if (intent.updatedAt > group.updatedAt) {
        group.updatedAt = intent.updatedAt; // Keep the latest idle time
      }
    }

    const groupedArray = Array.from(groupedMap.values());
    const total = groupedArray.length;
    const paginatedGroups = groupedArray.slice(skip, skip + limit);

    return NextResponse.json({ intents: paginatedGroups, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error: any) {
    console.error("Error fetching intents:", error);
    return NextResponse.json({ error: "Failed to fetch intents", details: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "vendor" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { intentId, action } = body;

    if (!intentId || action !== "DISMISS") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const intent = await prisma.userIntent.findUnique({ where: { id: parseInt(intentId) } });
    if (!intent) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.role === "vendor" && intent.vendorId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.userIntent.update({
      where: { id: intent.id },
      data: { isDismissed: true }
    });

    return NextResponse.json({ success: true, intent: updated });
  } catch (error: any) {
    console.error("Error dismissing intent:", error);
    return NextResponse.json({ error: "Failed to dismiss intent" }, { status: 500 });
  }
}
