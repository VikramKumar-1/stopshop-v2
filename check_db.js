const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.product.count({ where: { active: true } });
  console.log("Total active products:", count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
