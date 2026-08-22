const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.order.findUnique({where: {orderNumber: 'SS-260822-735809'}})
  .then(console.log)
  .finally(() => prisma.$disconnect());
