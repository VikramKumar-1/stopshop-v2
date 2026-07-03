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
    const { events } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "Invalid events array" }, { status: 400 });
    }

    // Fetch the correct vendorId for each product directly from the DB
    const productIds = events.map((e: any) => parseInt(e.productId)).filter((id: number) => !isNaN(id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, vendorId: true }
    });
    
    const productVendorMap = new Map(products.map(p => [p.id, p.vendorId]));

    const upserts = events.map((event: any) => {
      const pIdNum = parseInt(event.productId);
      const actualVendorId = productVendorMap.get(pIdNum);
      
      if (isNaN(pIdNum) || !actualVendorId) return null;

      return prisma.userIntent.upsert({
        where: {
          userId_productId_type: {
            userId: session.userId,
            productId: pIdNum,
            type: event.type.toUpperCase()
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
          type: event.type.toUpperCase(),
          hasPurchased: false
        }
      });
    });
    
    const validUpserts = upserts.filter(Boolean) as any[];

    await prisma.$transaction(validUpserts);

    return NextResponse.json({ success: true, processed: upserts.length });
  } catch (error: any) {
    console.error("Error batching intents:", error);
    return NextResponse.json({ error: "Failed to process batch" }, { status: 500 });
  }
}
