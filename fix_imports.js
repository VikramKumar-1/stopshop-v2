const fs = require('fs');
const files = [
  'src/app/api/vendor/workers/route.ts',
  'src/app/api/vendor/workers/assign/route.ts',
  'src/app/api/vendor/workers/search/route.ts',
  'src/app/api/vendor/workers/magic-link/route.ts',
  'src/app/api/auth/worker-magic/route.ts'
];
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import \{ PrismaClient \} from \"@prisma\/client\";/, 'import { prisma } from \"@/lib/db\";');
  code = code.replace(/const prisma = new PrismaClient\(\);\n*/, '');
  fs.writeFileSync(file, code);
}
console.log('Fixed Prisma imports');
