const { execSync } = require('child_process');
const fs = require('fs');

try {
  const diff = execSync('git log -p -n 3 src/features/home/components/ShopByMaterial.tsx').toString();
  fs.writeFileSync('c:\\Users\\vikur\\Downloads\\stopshops\\scratch\\git_diff_material.txt', diff);
  console.log("Written diff to scratch/git_diff_material.txt");
} catch (e) {
  fs.writeFileSync('c:\\Users\\vikur\\Downloads\\stopshops\\scratch\\git_error.txt', e.toString());
  console.log("Error running git commands:", e.toString());
}
