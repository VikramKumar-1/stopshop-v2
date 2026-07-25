const fs = require('fs');
let code = fs.readFileSync('src/app/worker/login/page.tsx', 'utf8');

// Read invite code from URL
code = code.replace(
  'const redirect = searchParams.get("redirect") || "/worker/studio";',
  'const redirect = searchParams.get("redirect") || "/worker/studio";\n  const inviteParam = searchParams.get("invite") || "";'
);

// Set default value for inviteCode
code = code.replace(
  'inviteCode: "",',
  'inviteCode: inviteParam,'
);

// If inviteCode is present in URL, make it read-only
code = code.replace(
  'onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}',
  'onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}\n                  readOnly={!!inviteParam}'
);

code = code.replace(
  'className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-mono text-orange-600 transition-colors"',
  'className={`w-full px-4 py-3 border rounded-xl focus:outline-none text-sm font-mono transition-colors ${inviteParam ? "bg-orange-500/10 border-orange-500/50 text-orange-700 cursor-not-allowed" : "bg-orange-500/5 border-orange-500/30 text-orange-600 focus:border-orange-500"}`}'
);

fs.writeFileSync('src/app/worker/login/page.tsx', code);
console.log('Worker login updated for URL invite');
