const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const settlements = await prisma.settlement.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            deliveredAt: true,
            paymentMethod: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    console.log("Found", settlements.length, "settlements.");
    if (settlements.length > 0) {
       const vendorIds = Array.from(new Set(settlements.map(s => s.vendorId)));
       const vendors = await prisma.user.findMany({
          where: { id: { in: vendorIds } },
       });
       console.log("Found vendors for settlements:", vendors.length);
       if (vendors.length === 0) {
          console.log("CRITICAL: Settlements exist, but vendors do not! vendorIds:", vendorIds);
       }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
