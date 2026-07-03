const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  const intents = await prisma.userIntent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(intents, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
