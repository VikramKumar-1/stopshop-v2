const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: 'SS-260608-4794'
    }
  });

  if (!order) {
    console.log("Order SS-260608-4794 not found!");
    return;
  }

  const deleted = await prisma.returnRequest.deleteMany({
    where: {
      orderId: order.id
    }
  });

  console.log("Deleted return request count:", deleted.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
