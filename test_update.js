const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const order = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
  
  const lock = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: "PENDING" },
    data: { paymentStatus: "PROCESSING" }
  });
  console.log("lock:", lock);

  // revert
  await prisma.order.updateMany({
    where: { id: order.id },
    data: { paymentStatus: "PENDING" }
  });
}
main().then(() => prisma.$disconnect()).catch(console.error);
