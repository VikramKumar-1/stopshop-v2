const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find a vendor
  const vendor = await prisma.user.findFirst({ where: { role: 'vendor' } });
  if (!vendor) {
    console.log("No vendor found!");
    return;
  }

  // Find an order
  const order = await prisma.order.findFirst();
  if (!order) {
    console.log("No order found!");
    return;
  }

  // Create a settlement
  const settlement = await prisma.settlement.create({
    data: {
      orderId: order.id,
      vendorId: vendor.id,
      orderAmountPaise: 100000, // Rs 1000
      commissionPaise: 10000,   // Rs 100
      vendorPayoutPaise: 90000, // Rs 900
      status: "ELIGIBLE",       // Make it eligible so Pay Out shows
      holdUntil: new Date(),
    }
  });

  console.log("Created dummy settlement:", settlement.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
