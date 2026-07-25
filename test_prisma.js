const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('test', 10);
    const newWorker = await prisma.user.create({
      data: {
        name: 'Vikram Kumar',
        email: 'worker_test5@vendor1.stopshop.local',
        password: hashedPassword,
        role: 'user',
        parentVendorId: 1
      }
    });
    console.log('Success:', newWorker.id);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
