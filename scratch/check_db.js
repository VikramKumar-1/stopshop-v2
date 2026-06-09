const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const latestReturns = await prisma.returnRequest.findMany({
    orderBy: { id: 'desc' },
    take: 5,
    include: { order: true }
  });
  console.log(JSON.stringify(latestReturns, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
