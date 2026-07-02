import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { aggregateProductReviews } from "@/lib/reviews";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const reviewId = parseInt(params.id);
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    
    if (existing.userId !== user.userId && user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { rating, title, comment, images, isApproved } = body;

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;
    if (images !== undefined) updateData.images = JSON.parse(JSON.stringify(images));
    if (user.role === "admin" && isApproved !== undefined) updateData.isApproved = isApproved;

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    await aggregateProductReviews(existing.productId);

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const reviewId = parseInt(params.id);
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    
    if (existing.userId !== user.userId && user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await aggregateProductReviews(existing.productId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete review" }, { status: 500 });
  }
}
