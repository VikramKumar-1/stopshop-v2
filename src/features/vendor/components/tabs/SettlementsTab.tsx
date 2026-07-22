"use client";

import React from "react";
import { Award, Clock } from "lucide-react";

interface SettlementsTabProps {
  settlementSettings: any;
  settlementSummary: any;
  settlementTab: "ALL" | "HOLD" | "ELIGIBLE" | "SETTLED" | "DISPUTED";
  setSettlementTab: (tab: "ALL" | "HOLD" | "ELIGIBLE" | "SETTLED" | "DISPUTED") => void;
  settlements: any[];
}

export default function SettlementsTab({
  settlementSettings,
  settlementSummary,
  settlementTab,
  setSettlementTab,
  settlements,
}: SettlementsTabProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filtered = (settlements || []).filter(s => settlementTab === "ALL" || s.status === settlementTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedSettlements = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [settlementTab]);
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-heading flex items-center gap-2">
          <Award className="text-orange-500" size={28} />
          My Settlements & Ledger
        </h2>
      </div>

      {/* Payout Policy Info Banner */}
      {settlementSettings && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs shadow-sm">
          <div className="flex-1">
            <span className="font-bold text-orange-500 block uppercase tracking-wider text-[9px] mb-1">Payout Window & Rules</span>
            <span className="text-muted block leading-relaxed">
              Payout amount is held in <strong>Hold</strong> status during the <strong>{settlementSettings.returnWindowDays || 7}-day customer return window</strong>. 
              If no return/dispute is raised, funds move automatically to <strong>Eligible for Payout</strong>.
            </span>
            {settlementSummary && settlementSummary.eligible > 0 && (
              <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                💰 Upcoming Payout for this cycle: <span className="font-black text-xs">₹{(settlementSummary.eligible / 100).toLocaleString()}</span> (All eligible funds will be settled in the next run).
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-orange-500/10 text-orange-500 rounded-xl font-bold border border-orange-500/20 shrink-0 select-none">
            <Clock size={13} />
            Cycle: {settlementSettings.payoutSchedule || "MANUAL"}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {settlementSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-card border border-border rounded-2xl p-4 cursor-pointer hover:border-orange-500/40 transition-colors shadow-sm" onClick={() => setSettlementTab("HOLD")}>
            <p className="text-[10px] uppercase font-bold text-muted">Total on Hold</p>
            <p className="text-lg font-bold text-orange-500 mt-1">₹{(settlementSummary.hold / 100).toLocaleString()}</p>
          </div>
          <div className="bg-surface-card border border-border rounded-2xl p-4 cursor-pointer hover:border-emerald-500/40 transition-colors shadow-sm" onClick={() => setSettlementTab("ELIGIBLE")}>
            <p className="text-[10px] uppercase font-bold text-muted">Eligible for Payout</p>
            <p className="text-lg font-bold text-emerald-500 mt-1">₹{(settlementSummary.eligible / 100).toLocaleString()}</p>
          </div>
          <div className="bg-surface-card border border-border rounded-2xl p-4 cursor-pointer hover:border-blue-500/40 transition-colors shadow-sm" onClick={() => setSettlementTab("SETTLED")}>
            <p className="text-[10px] uppercase font-bold text-muted">Total Settled</p>
            <p className="text-lg font-bold text-blue-500 mt-1">₹{(settlementSummary.settled / 100).toLocaleString()}</p>
          </div>
          <div className="bg-surface-card border border-border rounded-2xl p-4 cursor-pointer hover:border-red-500/40 transition-colors shadow-sm" onClick={() => setSettlementTab("DISPUTED")}>
            <p className="text-[10px] uppercase font-bold text-muted">Disputed</p>
            <p className="text-lg font-bold text-red-500 mt-1">₹{(settlementSummary.disputed / 100).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
        {(["ALL", "HOLD", "ELIGIBLE", "SETTLED", "DISPUTED"] as const).map((tab) => {
          const count = tab === "ALL" ? settlements.length : settlements.filter(s => s.status === tab).length;
          const isActive = settlementTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setSettlementTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive 
                  ? "bg-heading text-surface shadow-sm" 
                  : "bg-surface-card hover:bg-surface-hover text-muted hover:text-heading border border-border"
              }`}
            >
              {tab === "ALL" ? "All Entries" : tab.replace(/_/g, " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* List Table */}
      <div className="bg-surface-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="p-4 font-bold uppercase tracking-wider">Order</th>
              <th className="p-4 font-bold uppercase tracking-wider">Status</th>
              <th className="p-4 font-bold uppercase tracking-wider">Total Value</th>
              <th className="p-4 font-bold uppercase tracking-wider">My Payout</th>
              <th className="p-4 font-bold uppercase tracking-wider">Hold Until</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">No settlement records found in this status.</td>
              </tr>
            )}
            {paginatedSettlements.map(s => (
                <tr key={s.id} className="hover:bg-surface-hover">
                  <td className="p-4 font-bold text-orange-500">{s.order.orderNumber}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                      s.status === 'HOLD' ? 'bg-amber-500/10 text-amber-600' :
                      s.status === 'ELIGIBLE' ? 'bg-emerald-500/10 text-emerald-600' :
                      s.status === 'SETTLED' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>{s.status}</span>
                  </td>
                  <td className="p-4">₹{(s.orderAmountPaise/100).toLocaleString()}</td>
                  <td className="p-4 font-bold text-emerald-500">₹{(s.vendorPayoutPaise/100).toLocaleString()}</td>
                  <td className="p-4 text-muted">
                    {s.status === "SETTLED" && s.settledAt ? (
                      <span className="text-[10px] text-blue-600 font-bold block">
                        Settled on {new Date(s.settledAt).toLocaleDateString()}
                        {s.vendorPaymentRef && (
                          <span className="block mt-1 font-mono text-muted/80 break-all font-normal">
                            Ref: {s.vendorPaymentRef}
                          </span>
                        )}
                      </span>
                    ) : (
                      new Date(s.holdUntil).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {filtered.length > itemsPerPage && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-surface-card/60">
            <span className="text-xs text-muted font-medium">
              Showing <span className="font-bold text-heading">{Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}</span> - <span className="font-bold text-heading">{Math.min(filtered.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-heading">{filtered.length}</span> entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-500/10 hover:text-orange-500 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-bold px-2 text-heading">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-500/10 hover:text-orange-500 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
