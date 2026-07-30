const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, role: true } });
  console.log("Users:", users);
  
  const order = await prisma.order.findUnique({ where: { id: 'cms637fhz0009d4mit3krs3cg' }, select: { user: { select: { id: true, name: true } } } });
  console.log("Order User:", order.user);
}
main().then(() => prisma.$disconnect()).catch(console.error);
