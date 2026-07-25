const fs = require('fs');
let code = fs.readFileSync('src/app/vendor/camera/page.tsx', 'utf8');

if (!code.includes('import BarcodeScanner')) {
  // It's possible the lucide imports are slightly different, so let's just do a regex replace
  code = code.replace(
    /import \{([^}]+)\} from "lucide-react";/,
    'import { $1, Search, ScanLine } from "lucide-react";\nimport BarcodeScanner from "@/features/vendor/components/BarcodeScanner";'
  );
}

if (!code.includes('const [showScanner')) {
  code = code.replace(
    /const \[toast, setToast\] = useState<\{ message: string; type: "success" \| "error" \} \| null>\(null\);/,
    'const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);\n  const [showScanner, setShowScanner] = useState(false);'
  );
}

code = code.replace('onScan={(text) => {', 'onScan={(text: string) => {');

fs.writeFileSync('src/app/vendor/camera/page.tsx', code);
