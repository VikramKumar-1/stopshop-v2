const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
  console.log(JSON.stringify(orders.map(o => ({
    id: o.id,
    status: o.status,
    shiprocketStatus: o.shiprocketStatus,
    items: o.items.map(i => ({ id: i.id, dispatchImages: i.dispatchImages }))
  })), null, 2));
}
main();
