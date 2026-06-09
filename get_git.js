const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('git show HEAD:src/features/admin/components/AdminPanel.tsx').toString();
  fs.writeFileSync('original_admin_panel.txt', output);
  console.log("Written to original_admin_panel.txt");
} catch (e) {
  fs.writeFileSync('error.txt', e.toString());
}
