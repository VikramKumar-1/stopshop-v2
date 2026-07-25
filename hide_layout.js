const fs = require('fs');

function hideForWorker(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('if (pathname?.startsWith("/worker/studio")) return null;')) return;
  
  code = code.replace(/export function (Navbar|CategoryStrip|Footer)\(\s*\)\s*\{/, (match) => {
    return match + '\n  const pathname = usePathname();\n  if (pathname?.startsWith("/worker/studio")) return null;\n';
  });
  
  if (!code.includes('import { usePathname } from "next/navigation";') && 
      !code.includes("import { usePathname } from 'next/navigation';")) {
    code = 'import { usePathname } from "next/navigation";\n' + code;
  }
  
  fs.writeFileSync(file, code);
}

hideForWorker('src/features/core/components/Navbar.tsx');
hideForWorker('src/features/core/components/CategoryStrip.tsx');
hideForWorker('src/features/core/components/Footer.tsx');
console.log('Successfully hidden global layout on worker studio');
