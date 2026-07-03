import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "vendor" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { intentIds, userIds, dismissIntentIds, discountPct, discountAmt, expiresAtHours } = body;

    if ((!intentIds || intentIds.length === 0) && (!userIds || userIds.length === 0)) {
      return NextResponse.json({ error: "Missing required targets (intent IDs or user IDs)" }, { status: 400 });
    }

    if (!discountPct && !discountAmt) {
      return NextResponse.json({ error: "Missing discount value" }, { status: 400 });
    }

    const hours = parseInt(expiresAtHours) || 48;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    const offersData: any[] = [];
    const intentsToDismiss: number[] = dismissIntentIds ? [...dismissIntentIds] : [];

    if (intentIds && intentIds.length > 0) {
      // Abandoned Carts logic (individual product coupons)
      const intents = await prisma.userIntent.findMany({
        where: {
          id: { in: intentIds.map((id: string | number) => parseInt(id as string)) },
          vendorId: session.userId,
          hasPurchased: false,
          isDismissed: false
        }
      });

      intents.forEach((intent) => {
        offersData.push({
          vendorId: session.userId,
          userId: intent.userId,
          productId: intent.productId,
          discountPct: discountPct ? parseFloat(discountPct) : null,
          discountAmt: discountAmt ? parseFloat(discountAmt) : null,
          expiresAt,
          isActive: true
        });
        intentsToDismiss.push(intent.id);
      });
    }

    if (userIds && userIds.length > 0) {
      // Loyal Customers / Grouped Carts logic (Store-wide coupons)
      // Use a Set to ensure unique userIds if array contains duplicates
      const uniqueUserIds = Array.from(new Set(userIds.map((id: any) => parseInt(id))));
      
      uniqueUserIds.forEach((uId) => {
        offersData.push({
          vendorId: session.userId,
          userId: uId as number,
          productId: null, // Store-wide
          discountPct: discountPct ? parseFloat(discountPct) : null,
          discountAmt: discountAmt ? parseFloat(discountAmt) : null,
          expiresAt,
          isActive: true
        });
      });
    }

    if (offersData.length === 0) {
      return NextResponse.json({ error: "No valid targets found to process" }, { status: 400 });
    }

    const transactions: any[] = [
      prisma.targetedOffer.createMany({ data: offersData })
    ];

    if (intentsToDismiss.length > 0) {
      transactions.push(
        prisma.userIntent.updateMany({
          where: { id: { in: intentsToDismiss } },
          data: { isDismissed: true }
        })
      );
    }

    const results = await prisma.$transaction(transactions);
    
    // results[0] is the result of createMany, which returns { count: number }
    const createdCount = results[0]?.count || 0;

    return NextResponse.json({ success: true, count: createdCount });
  } catch (error: any) {
    console.error("Error creating bulk offers:", error);
    return NextResponse.json({ error: "Failed to create bulk offers" }, { status: 500 });
  }
}
