require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const latestOrder = await prisma.order.findMany({ take: 1, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(latestOrder, null, 2));
}
main().finally(() => prisma.$disconnect());
