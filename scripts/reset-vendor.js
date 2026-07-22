const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("vendor123", 10);
  const updated = await prisma.user.updateMany({
    where: { email: "vendor@stopshop.com" },
    data: { password: hash }
  });
  console.log("Updated vendor accounts:", updated.count);
}

main()
  .then(() => console.log("Vendor password set to: vendor123"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
