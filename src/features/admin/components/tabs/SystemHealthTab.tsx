"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Server, Activity, Zap, Database, Lock, Unlock, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface HealthData {
  lockdownMode: boolean;
  server: {
    dbLatencyMs: number;
    memoryUsagePercent: number;
    uptimeSeconds: number;
  };
  traffic: {
    activeCheckouts: number;
    completedOrders: number;
  };
  services: {
    razorpayPingMs: number;
    shiprocketPingMs: number;
  };
  diagnostics: Array<{
    id?: number;
    timestamp?: string;
    severity: string;
    title: string;
    description: string;
    impact: string;
    recommendation: string;
  }>;
  bannedIps: Array<{
    ip: string;
    reason: string;
    createdAt: string;
  }>;
}

interface Props {
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
}

export default function SystemHealthTab({ showToast }: Props) {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) throw new Error("Failed to fetch health data");
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      showToast("Failed to connect to health monitor", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 60 seconds (optimized for DB safety)
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleLockdown = async () => {
    if (!data) return;
    const newState = !data.lockdownMode;
    
    if (newState) {
      const promptVal = window.prompt("🚨 CRITICAL WARNING 🚨\n\nAre you sure you want to activate LOCKDOWN MODE?\n\nThis will instantly block all NEW checkouts across the entire platform. Customers currently entering payment details will finish safely, but no one else can start a checkout.\n\nType 'YES' to confirm.");
      if (promptVal !== 'YES') return;
    }

    setToggling(true);
    try {
      const res = await fetch("/api/admin/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lockdownMode: newState })
      });
      if (!res.ok) throw new Error("Failed to toggle lockdown");
      
      setData({ ...data, lockdownMode: newState });
      if (newState) {
        showToast("Lockdown Mode Activated Successfully.", "success");
      } else {
        showToast("Lockdown Lifted. Checkouts have resumed normally.", "success");
      }
    } catch (error) {
      showToast("Failed to change lockdown state", "error");
    } finally {
      setToggling(false);
    }
  };

  const unbanIp = async (ip: string) => {
    try {
      showToast("Unbanning IP...", "info");
      const res = await fetch("/api/admin/security/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      });
      if (!res.ok) throw new Error("Failed");
      showToast(`IP ${ip} has been unbanned.`, "success");
      fetchHealth(); // Refresh list
    } catch (error) {
      showToast("Failed to unban IP", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted">
        <Activity className="animate-spin mb-4 text-orange-500" size={32} />
        <p>Scanning System Health...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 relative">
      {/* 🔴 PANIC BUTTON SECTION */}
      <div className={`p-6 rounded-3xl border-2 transition-colors duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${data.lockdownMode ? "bg-red-500/10 border-red-500/50" : "bg-surface-card border-border shadow-sm"}`}>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${data.lockdownMode ? "bg-red-500 text-white animate-pulse" : "bg-surface-hover text-muted"}`}>
            {data.lockdownMode ? <Lock size={32} /> : <Unlock size={32} />}
          </div>
          <div>
            <h2 className={`text-2xl font-black font-display tracking-tight ${data.lockdownMode ? "text-red-500" : "text-heading"}`}>
              {data.lockdownMode ? "SYSTEM IN LOCKDOWN" : "SYSTEM SECURE"}
            </h2>
            <p className="text-muted text-sm max-w-md mt-1">
              {data.lockdownMode 
                ? "All new checkouts are currently blocked. The site is in maintenance mode to prevent further attacks." 
                : "Active Threat Detector is running. If you suspect a DDoS or Brute Force attack, activate Lockdown Mode."}
            </p>
          </div>
        </div>
        <button 
          onClick={toggleLockdown}
          disabled={toggling}
          className={`shrink-0 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-xl ${
            data.lockdownMode 
            ? "bg-surface text-heading border border-border hover:bg-surface-hover" 
            : "bg-red-600 hover:bg-red-700 text-white hover:scale-105 hover:shadow-red-500/20"
          }`}
        >
          {toggling ? "PROCESSING..." : data.lockdownMode ? "LIFT LOCKDOWN" : "ACTIVATE PANIC BUTTON"}
        </button>
      </div>

      {/* 📊 METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* DB Health */}
        <div className="bg-surface-card p-5 rounded-2xl border border-border hover:border-orange-500/30 transition-colors flex flex-col shadow-sm group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <Database size={16} className="text-orange-500" /> Database
            </span>
            <span className="flex h-3 w-3 relative">
              {data.server.dbLatencyMs < 200 ? (
                 <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></>
              ) : (
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              )}
            </span>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-heading font-display tracking-tight">{data.server.dbLatencyMs}</span>
              <span className="text-lg text-muted font-bold">ms</span>
            </div>
            <div className="pt-3 border-t border-border/60">
               <p className="text-xs text-muted leading-relaxed mb-2">Measures how fast your database responds to queries.</p>
               <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  <CheckCircle2 size={12} /> Safe: &lt; 200ms
               </div>
            </div>
          </div>
        </div>

        {/* Server Memory */}
        <div className="bg-surface-card p-5 rounded-2xl border border-border hover:border-blue-500/30 transition-colors flex flex-col shadow-sm group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <Server size={16} className="text-blue-500" /> Server RAM
            </span>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-1">
               <span className={`text-4xl font-black font-display tracking-tight ${data.server.memoryUsagePercent > 85 ? "text-red-500" : "text-heading"}`}>
                 {data.server.memoryUsagePercent}
               </span>
               <span className="text-lg text-muted font-bold">%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-surface-hover rounded-full h-1.5 mt-3 mb-4 overflow-hidden">
               <div className={`h-full rounded-full ${data.server.memoryUsagePercent > 85 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${data.server.memoryUsagePercent}%` }}></div>
            </div>
            <div className="pt-3 border-t border-border/60">
               <p className="text-xs text-muted leading-relaxed mb-2">Current physical memory load of your server.</p>
               <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  <CheckCircle2 size={12} /> Safe: &lt; 85%
               </div>
            </div>
          </div>
        </div>

        {/* Traffic Spike Monitor */}
        <div className="bg-surface-card p-5 rounded-2xl border border-border hover:border-emerald-500/30 transition-colors flex flex-col shadow-sm group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" /> Active Carts
            </span>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-heading font-display tracking-tight">{data.traffic.activeCheckouts}</span>
              <span className="text-sm font-bold text-emerald-500">vs {data.traffic.completedOrders} Paid</span>
            </div>
            <div className="pt-3 border-t border-border/60">
               <p className="text-xs text-muted leading-relaxed mb-2">Number of stuck carts vs paid orders in the last 24h.</p>
               <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  <CheckCircle2 size={12} /> Safe: Normal Ratio
               </div>
            </div>
          </div>
        </div>

        {/* API Services */}
        <div className="bg-surface-card p-5 rounded-2xl border border-border hover:border-purple-500/30 transition-colors flex flex-col shadow-sm group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <Zap size={16} className="text-purple-500" /> Ext. Services
            </span>
          </div>
          <div className="mt-auto space-y-3">
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center text-sm font-bold">
                 <span className="text-heading">Razorpay</span>
                 <span className="text-emerald-500 font-display">{data.services.razorpayPingMs}ms</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                 <span className="text-heading">Shiprocket</span>
                 <span className="text-emerald-500 font-display">{data.services.shiprocketPingMs}ms</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border/60">
               <p className="text-xs text-muted leading-relaxed mb-2">Real-time network latency to 3rd-party APIs.</p>
               <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  <CheckCircle2 size={12} /> Safe: &lt; 500ms
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧠 INTELLIGENT DIAGNOSTICS ENGINE */}
      <div className="bg-surface-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-bold text-heading text-lg">Intelligent Diagnostics</h3>
              <p className="text-xs text-muted font-medium">Automated anomaly detection scanner</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SCANNER ACTIVE
          </div>
        </div>
        
        <div className="p-6">
          {data.diagnostics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={48} className="text-emerald-500 mb-4 opacity-50" />
              <h4 className="text-lg font-bold text-heading">Zero Anomalies Detected</h4>
              <p className="text-sm text-muted max-w-sm mt-1">Your system is running flawlessly. The diagnostics engine found no stuck payments, broken logic, or SLA breaches.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.diagnostics.map((bug, i) => (
                <div key={i} className={`p-5 rounded-2xl border flex gap-4 ${
                  bug.severity === 'CRITICAL' ? 'bg-red-500/5 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-[pulse_3s_ease-in-out_infinite]' : 
                  bug.severity === 'WARNING' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'
                }`}>
                  <div className={`mt-0.5 shrink-0 ${
                    bug.severity === 'CRITICAL' ? 'text-red-500' : 
                    bug.severity === 'WARNING' ? 'text-amber-500' : 'text-blue-500'
                  }`}>
                    {bug.severity === 'CRITICAL' ? <AlertTriangle size={24} className={bug.severity === 'CRITICAL' ? 'animate-bounce' : ''} /> : <AlertCircle size={24} />}
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded ${
                            bug.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                            bug.severity === 'WARNING' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                         }`}>{bug.severity}</span>
                         {bug.timestamp && (
                           <span className="text-[10px] text-muted font-bold">
                             {new Date(bug.timestamp).toLocaleString()}
                           </span>
                         )}
                      </div>
                      <h4 className="font-bold text-heading text-lg">{bug.title}</h4>
                      <p className="text-sm text-heading/80 font-medium">{bug.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                       <div className="bg-surface p-3 rounded-xl border border-border">
                          <span className="block text-[10px] uppercase font-black text-muted mb-1">Impact</span>
                          <span className="text-heading font-medium">{bug.impact}</span>
                       </div>
                       <div className="bg-surface p-3 rounded-xl border border-border">
                          <span className="block text-[10px] uppercase font-black text-muted mb-1">Recommended Fix</span>
                          <span className="text-heading font-medium">{bug.recommendation}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🛑 IP BLACKLIST (WAF) */}
      <div className="bg-surface-card rounded-3xl border border-border overflow-hidden shadow-sm mt-6">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-bold text-heading text-lg">Web Application Firewall</h3>
              <p className="text-xs text-muted font-medium">Banned IPs for Malicious Activity</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 text-xs font-bold flex items-center gap-1.5 border border-red-500/20">
            AUTO-BAN ACTIVE
          </div>
        </div>
        
        <div className="p-0">
          {!data.bannedIps || data.bannedIps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border-t border-border/50">
              <ShieldAlert size={32} className="text-emerald-500 mb-2 opacity-50" />
              <p className="text-sm text-muted font-medium">No malicious IPs currently banned.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/50 border-y border-border">
                  <tr>
                    <th className="px-6 py-3 font-bold text-muted uppercase text-xs tracking-wider">IP Address</th>
                    <th className="px-6 py-3 font-bold text-muted uppercase text-xs tracking-wider">Reason</th>
                    <th className="px-6 py-3 font-bold text-muted uppercase text-xs tracking-wider">Date Banned</th>
                    <th className="px-6 py-3 font-bold text-muted uppercase text-xs tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.bannedIps.map((ban, idx) => (
                    <tr key={idx} className="hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-4 font-display font-black text-red-500">{ban.ip}</td>
                      <td className="px-6 py-4 font-medium text-heading">{ban.reason}</td>
                      <td className="px-6 py-4 text-xs font-bold text-muted">{new Date(ban.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => unbanIp(ban.ip)}
                          className="px-3 py-1 bg-surface border border-border hover:border-emerald-500 hover:text-emerald-500 rounded text-xs font-bold transition-colors"
                        >
                          Unban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
