const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.orderItem.findMany({
    where: {
      dispatchImages: { not: null }
    },
    take: 10
  });
  
  console.log("OrderItems with dispatchImages:", JSON.stringify(items, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
