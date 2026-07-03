const { PrismaClient } = require("../src/generated/client");
const prisma = new PrismaClient();

async function main() {
  const intents = await prisma.userIntent.findMany({
    include: { product: { select: { id: true, vendorId: true } } }
  });

  let fixed = 0;
  for (const intent of intents) {
    if (intent.product && intent.vendorId !== intent.product.vendorId) {
      await prisma.userIntent.update({
        where: { id: intent.id },
        data: { vendorId: intent.product.vendorId }
      });
      fixed++;
      console.log("Fixed intent", intent.id, "from vendorId", intent.vendorId, "to", intent.product.vendorId);
    }
  }
  console.log("Total fixed:", fixed);
}

main().catch(console.error).finally(() => prisma.$disconnect());
