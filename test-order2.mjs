import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const o = await prisma.order.findUnique({where: {orderNumber: 'SS-260822-735809'}});
  console.log(o.status, o.cancellationReason);
}
main().finally(() => prisma.$disconnect());
