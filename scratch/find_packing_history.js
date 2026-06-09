const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Get git log with patch for VendorDashboard.tsx filtering by packingImages
  const output = execSync('git log -p -n 3 -G "packingImages" -- src/features/vendor/components/VendorDashboard.tsx', {
     cwd: path.resolve(__dirname, '..')
  }).toString();
  
  fs.writeFileSync(path.resolve(__dirname, 'git_output.txt'), output);
  console.log("Git log written to git_output.txt");
} catch (e) {
  console.error("Error executing git command:", e);
  fs.writeFileSync(path.resolve(__dirname, 'git_error.txt'), e.stack || e.toString());
}
