import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { aggregateProductReviews } from "@/lib/reviews";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productIdStr = searchParams.get("productId");
    const pageStr = searchParams.get("page") || "1";
    const limitStr = searchParams.get("limit") || "10";

    if (!productIdStr) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const productId = parseInt(productIdStr);
    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        include: {
          user: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { productId, isApproved: true }
      })
    ]);

    // Also get the distribution
    const allApproved = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true }
    });
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;
    for (const r of allApproved) {
      distribution[r.rating as keyof typeof distribution]++;
      totalScore += r.rating;
    }
    const averageRating = totalCount > 0 ? (totalScore / totalCount) : 0;

    return NextResponse.json({
      success: true,
      reviews,
      totalCount,
      averageRating,
      distribution
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, title, comment, images, orderId } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: "Product ID and rating are required" }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: parseInt(productId),
          userId: user.userId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    // Determine verification status
    let isVerified = false;
    let actualOrderId = null;
    
    if (orderId) {
       // Check if this order actually belongs to this user, contains the product, and is delivered
       const order = await prisma.order.findUnique({
         where: { id: orderId },
         include: { items: true }
       });
       
       if (order && order.userId === user.userId && order.status === "DELIVERED") {
         const hasProduct = order.items.some(i => i.productId === parseInt(productId));
         if (hasProduct) {
           isVerified = true;
           actualOrderId = orderId;
         }
       }
    } else {
       // Auto-detect if user has bought this item before
       const pastOrders = await prisma.order.findMany({
         where: {
           userId: user.userId,
           status: "DELIVERED",
           items: { some: { productId: parseInt(productId) } }
         },
         orderBy: { createdAt: 'desc' },
         take: 1
       });
       
       if (pastOrders.length > 0) {
         isVerified = true;
         actualOrderId = pastOrders[0].id;
       }
    }

    const newReview = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        userId: user.userId,
        rating: parseInt(rating),
        title: title || null,
        comment: comment || "",
        images: images ? JSON.parse(JSON.stringify(images)) : [],
        isVerified,
        orderId: actualOrderId,
        isApproved: true, // Auto-approve by default as requested
      }
    });

    // Update aggregate
    await aggregateProductReviews(parseInt(productId));

    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}
