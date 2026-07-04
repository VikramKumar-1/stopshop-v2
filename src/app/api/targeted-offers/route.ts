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
    const { userId, productId, discountPct, discountAmt, expiresAtHours } = body;

    if (!userId || (!discountPct && !discountAmt)) {
      return NextResponse.json({ error: "Missing required fields (user ID and discount value)" }, { status: 400 });
    }

    const targetUserId = parseInt(userId);
    const targetProductId = productId ? parseInt(productId) : null;
    const hours = parseInt(expiresAtHours) || 48; // Default 48 hours

    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const offer = await prisma.targetedOffer.create({
      data: {
        vendorId: session.userId,
        userId: targetUserId,
        productId: targetProductId,
        discountPct: discountPct ? parseFloat(discountPct) : null,
        discountAmt: discountAmt ? parseFloat(discountAmt) : null,
        expiresAt,
        isActive: true
      },
      include: {
        product: {
          select: { name: true, image: true, price: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error("Error creating targeted offer:", error);
    return NextResponse.json({ error: "Failed to create targeted offer" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const asBuyer = searchParams.get("asBuyer") === "true";

    if (session.role === "vendor" && !asBuyer) {
      const offers = await prisma.targetedOffer.findMany({
        where: { vendorId: session.userId },
        include: {
          product: {
            select: { id: true, name: true, image: true, price: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(offers);
    } else {
      // Normal user: fetch active offers assigned to them
      const offers = await prisma.targetedOffer.findMany({
        where: {
          userId: session.userId,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        include: {
          product: {
            select: { id: true, name: true, image: true, price: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(offers);
    }
  } catch (error: any) {
    console.error("Error fetching targeted offers:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
