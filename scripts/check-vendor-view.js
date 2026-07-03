const { PrismaClient } = require("../src/generated/client");
const p = new PrismaClient();

async function main() {
  // Simulate what the vendor (userId=150009) sees in Abandoned Carts
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const allIntents = await p.userIntent.findMany({
    where: {
      hasPurchased: false,
      isDismissed: false,
      vendorId: 150009,
      updatedAt: { gt: sevenDaysAgo }
    },
    include: {
      product: { select: { id: true, name: true, price: true, image: true } },
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { updatedAt: "desc" }
  });

  console.log("Raw intents for vendor 150009:", allIntents.length);
  
  // Group by user
  const groupedMap = new Map();
  for (const intent of allIntents) {
    if (!intent.user) continue;
    if (!groupedMap.has(intent.userId)) {
      groupedMap.set(intent.userId, {
        userId: intent.userId,
        user: intent.user,
        products: []
      });
    }
    groupedMap.get(intent.userId).products.push({
      id: intent.product?.id,
      name: intent.product?.name,
      price: intent.product?.price
    });
  }

  const grouped = Array.from(groupedMap.values());
  console.log("\nGrouped result:");
  console.log(JSON.stringify(grouped, null, 2));
}

main().catch(console.error).finally(() => p.$disconnect());
