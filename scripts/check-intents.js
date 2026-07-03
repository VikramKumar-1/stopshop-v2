const { PrismaClient } = require("../src/generated/client");
const p = new PrismaClient();

async function main() {
  const intents = await p.userIntent.findMany({
    include: {
      product: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } }
    },
    orderBy: { updatedAt: "desc" }
  });
  
  console.log(JSON.stringify(intents.map(i => ({
    id: i.id,
    userId: i.userId,
    userName: i.user?.name,
    productId: i.productId,
    productName: i.product?.name,
    vendorId: i.vendorId,
    type: i.type,
    dismissed: i.isDismissed
  })), null, 2));
}

main().catch(console.error).finally(() => p.$disconnect());
