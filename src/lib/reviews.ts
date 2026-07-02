import { prisma } from "@/lib/db";

export async function aggregateProductReviews(productId: number) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    select: {
      rating: true,
    },
  });

  const count = reviews.length;
  const average =
    count > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
      : 5.0; // Default to 5.0 if no reviews

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Number(average.toFixed(1)),
      reviews: count,
    },
  });

  return { average: Number(average.toFixed(1)), count };
}
