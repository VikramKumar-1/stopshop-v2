const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', 'utf8');

// Replace state variables
code = code.replace(/const \[searchEmail, setSearchEmail\] = useState\(""\);/g, 'const [newWorkerName, setNewWorkerName] = useState("");');
code = code.replace(/const \[searchResult, setSearchResult\] = useState<any \| null>\(null\);/g, 'const [newWorkerMobile, setNewWorkerMobile] = useState("");');
code = code.replace(/const \[searching, setSearching\] = useState\(false\);/g, 'const [creating, setCreating] = useState(false);');

// Replace handleSearch with handleCreateWorker
const handleCreateWorker = `
  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim()) return;

    setCreating(true);
    setSearchError("");

    try {
      const res = await fetch(\`/api/vendor/workers\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorkerName, mobile: newWorkerMobile })
      });
      const data = await res.json();
      
      if (data.success) {
        setNewWorkerName("");
        setNewWorkerMobile("");
        await fetchWorkers(); // Refresh the list
      } else {
        setSearchError(data.error || "Failed to create worker");
      }
    } catch (e) {
      setSearchError("Network error occurred");
    } finally {
      setCreating(false);
    }
  };
`;

code = code.replace(/const handleSearch = async \(e: React\.FormEvent\) => \{[\s\S]*?finally \{\s*setSearching\(false\);\s*\}\s*\};/, handleCreateWorker);

// Replace UI form
const formUI = `
      <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-heading flex items-center gap-2">
              <UserPlus className="text-orange-500" size={20} />
              Add New Worker
            </h3>
            <p className="text-sm text-muted">Create an account for a new packing/QC worker.</p>
          </div>
        </div>

        <form onSubmit={handleCreateWorker} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
        )}
      </div>
`;

code = code.replace(/<div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm">[\s\S]*?\{searchResult && \([\s\S]*?\}\)/, formUI);

fs.writeFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', code);
console.log('WorkersTab updated to use Create form');
