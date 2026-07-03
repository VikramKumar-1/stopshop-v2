const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.userIntent.updateMany({
    data: { isDismissed: false }
  });
  console.log("All dismissed intents have been reset so they show up again.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
