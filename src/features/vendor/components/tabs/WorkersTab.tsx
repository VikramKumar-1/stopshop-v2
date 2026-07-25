"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, Camera, Loader2, Info, AlertTriangle, ShieldCheck, Mail, Phone, CalendarDays } from "lucide-react";
import QRCode from "qrcode";
import { AnimatePresence, motion } from "framer-motion";

export default function WorkersTab() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerMobile, setNewWorkerMobile] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [workerQrUrl, setWorkerQrUrl] = useState<string | null>(null);
  const [qrWorkerName, setQrWorkerName] = useState<string>("");

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch("/api/vendor/workers");
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  
  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim()) return;

    setCreating(true);
    setSearchError("");

    try {
      const res = await fetch(`/api/vendor/workers`, {
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


  const handleAssignment = async (workerId: number, action: "assign" | "remove") => {
    try {
      const res = await fetch("/api/vendor/workers/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, action })
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchWorkers();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Failed to " + action + " worker");
    }
  };

  const handleGenerateQR = async (worker: any) => {
    try {
      const res = await fetch("/api/vendor/workers/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: worker.id })
      });
      const data = await res.json();
      if (data.success) {
        const url = `${window.location.origin}/api/auth/worker-magic?token=${data.magicToken}`;
        const qr = await QRCode.toDataURL(url, { width: 300, margin: 2 });
        setWorkerQrUrl(qr);
        setQrWorkerName(worker.name);
      } else {
        alert("Failed to generate QR: " + data.error);
      }
    } catch (e) {
      alert("Error generating QR code");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-heading flex items-center gap-2">
              <ShieldCheck className="text-orange-500" size={20} />
              Create New Worker
            </h3>
            <p className="text-sm text-muted">Instantly register a new worker for your store. No email or password required.</p>
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

      <div className="bg-surface-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-heading">Active Workers</h3>
            <p className="text-sm text-muted">Workers currently packing orders for your store.</p>
          </div>
          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 font-bold">
            {workers.length}
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : workers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-4">
              <UserMinus className="text-muted" size={24} />
            </div>
            <h4 className="text-heading font-bold mb-1">No workers assigned</h4>
            <p className="text-sm text-muted max-w-sm mx-auto">Use the search bar above to find and assign users to your store.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {workers.map((worker) => (
              <div key={worker.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center text-xl font-bold border border-orange-500/20 shrink-0">
                    {worker.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-heading text-sm">{worker.name}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                      <span className="text-xs text-muted flex items-center gap-1.5"><Mail size={12} /> {worker.email}</span>
                      <span className="text-xs text-muted flex items-center gap-1.5"><CalendarDays size={12} /> Joined {new Date(worker.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row items-center w-full sm:w-auto gap-2">
                  <button
                    onClick={() => handleGenerateQR(worker)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera size={14} />
                    Login QR
                  </button>
                  <button
                    onClick={() => {
                      if(window.confirm(`Are you sure you want to remove ${worker.name}? They will lose access to your studio.`)) {
                        handleAssignment(worker.id, "remove");
                      }
                    }}
                    className="px-4 py-2.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl font-bold text-xs transition-all flex items-center justify-center"
                    title="Remove worker"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {workerQrUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setWorkerQrUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Camera size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{qrWorkerName}&apos;s Access</h3>
              <p className="text-sm text-gray-500 mb-6">Have {qrWorkerName.split(' ')[0]} scan this QR code with their mobile phone to instantly login to the Packing Studio.</p>
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-center mb-6">
                <img src={workerQrUrl} alt="Worker QR Code" className="w-56 h-56 rounded-xl shadow-sm" />
              </div>

              <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-xl border border-orange-200 flex items-start gap-2 text-left">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>This QR code uses a secure Magic Link that bypasses the login screen. It will expire in 1 year.</p>
              </div>
              
              <button 
                onClick={() => setWorkerQrUrl(null)}
                className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
