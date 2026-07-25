const fs = require('fs');

let code = fs.readFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', 'utf8');

// The exact form chunk
const oldFormStart = `<form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">`;
const oldFormEnd = `Assign to Store\n              </button>\n            )}\n          </div>\n        )}`;

const regex = /<form onSubmit=\{handleSearch\} className="flex flex-col sm:flex-row gap-3">[\s\S]*?Assign to Store\s*<\/button>\s*\)\}\s*<\/div>\s*\)\}/;

const newForm = `<form onSubmit={handleCreateWorker} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={newWorkerName}
              onChange={(e) => setNewWorkerName(e.target.value)}
              placeholder="Enter worker's full name..."
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-sm"
              required
            />
          </div>
          <div className="flex-1 w-full relative">
            <input
              type="tel"
              value={newWorkerMobile}
              onChange={(e) => setNewWorkerMobile(e.target.value)}
              placeholder="Mobile number (optional)"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newWorkerName.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-heading text-surface rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Add Worker
          </button>
        </form>

        {searchError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-start gap-2 text-sm">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>{searchError}</p>
          </div>
        )}`;

code = code.replace(regex, newForm);
fs.writeFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', code);
console.log('Fixed UI successfully');
