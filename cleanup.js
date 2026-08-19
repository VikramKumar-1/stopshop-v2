const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up test transactional data...');
  try {
    const r1 = await prisma.cartItem.deleteMany();
    const r2 = await prisma.cart.deleteMany();
    const r3 = await prisma.targetedOffer.deleteMany();
    const r4 = await prisma.userIntent.deleteMany();
    const r5 = await prisma.settlement.deleteMany();
    const r6 = await prisma.returnRequest.deleteMany();
    const r7 = await prisma.orderItem.deleteMany();
    const r8 = await prisma.order.deleteMany();
    const r9 = await prisma.inquiry.deleteMany();
    console.log('Deleted successfully.');
    console.log('Orders deleted:', r8.count);
    console.log('Inquiries deleted:', r9.count);
    console.log('Cart items deleted:', r1.count);
  } catch(e) {
    console.error('Error during cleanup:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
