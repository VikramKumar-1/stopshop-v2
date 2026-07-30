const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const logs = await prisma.systemLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log(logs);
}
main().then(() => prisma.$disconnect()).catch(console.error);
