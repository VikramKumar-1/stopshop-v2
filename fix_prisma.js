const cp = require('child_process');
try {
  cp.execSync('npx prisma generate', { stdio: 'inherit' });
} catch(e) {
  console.log('Failed to generate prisma, trying to clear .next');
  const fs = require('fs');
  fs.rmSync('.next', { recursive: true, force: true });
  try {
    cp.execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Generated successfully after clearing .next');
  } catch(e2) {
    console.log('Still failed');
  }
}
