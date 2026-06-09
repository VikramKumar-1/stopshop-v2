const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const vendorId = 9;
    try {
        const revenueGroups = await prisma.orderItem.groupBy({
          by: ['productId'],
          where: { 
             vendorId,
             order: {
                status: {
                   notIn: ["CANCELLED", "RETURNED", "RETURN_APPROVED"]
                }
             }
          },
          _sum: { totalPaise: true }
        });
        console.log("Success groupBy:", revenueGroups);
    } catch (e) {
        console.error("FAIL groupBy:", e.message);
    }
}

main().finally(() => prisma.$disconnect());
