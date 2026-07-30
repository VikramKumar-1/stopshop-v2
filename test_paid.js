const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const paidOrders = await prisma.order.findMany({ 
    where: { paymentStatus: 'PAID' },
    orderBy: { createdAt: 'desc' },
    take: 5 
  });
  console.log("Paid orders:", paidOrders.map(o => o.orderNumber));
}
main().then(() => prisma.$disconnect()).catch(console.error);
