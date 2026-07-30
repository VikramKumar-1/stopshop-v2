const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({ take: 3, orderBy: { createdAt: 'desc' }, select: { id: true, paymentStatus: true, status: true, orderNumber: true } });
  console.log(orders);
}
main().then(() => prisma.$disconnect());
