"use client";
import React from "react";
import { CheckCircle, CheckCircle2 } from "lucide-react";

export function VendorsTab({
  vendors,
  handleReviewVendor,
  handleOpenVendorModal,
  setRejectPromptModal,
  setPromptText,
}: {
  vendors: any[];
  handleReviewVendor: (vendorId: number, action: "APPROVE" | "REJECT", rejectionReason?: string) => void;
  handleOpenVendorModal: (v: any) => void;
  setRejectPromptModal: (val: any) => void;
  setPromptText: (val: string) => void;
}) {
  return (
              <div className="space-y-8">

                {/* ===== SECTION 1: NEW APPROVAL REQUESTS ===== */}
                <div className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 overflow-hidden shadow-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 bg-blue-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <h3 className="text-base font-black text-heading tracking-tight">New Approval Requests</h3>
                      <span className="ml-1 px-2.5 py-0.5 bg-blue-500 text-white text-[11px] font-black rounded-full shadow">
                        {vendors.filter(v => v.vendorStatus === "IN_REVIEW").length}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-widest">Waiting for Review</span>
                  </div>

                  {/* Content */}
                  {vendors.filter(v => v.vendorStatus === "IN_REVIEW").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <CheckCircle2 size={26} className="text-blue-400" />
                      </div>
                      <p className="text-sm font-bold text-heading">All caught up!</p>
                      <p className="text-xs text-muted">No pending KYC approval requests right now.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-blue-500/10 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {vendors.filter(v => v.vendorStatus === "IN_REVIEW").map(v => (
                        <div key={v.id} className="flex items-center justify-between px-6 py-4 hover:bg-blue-500/5 transition-colors">
                          {/* Vendor Info */}
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg uppercase shadow-md shadow-blue-500/20 shrink-0">
                              {v.name?.charAt(0) || "V"}
                            </div>
                            <div>
                              <p className="font-bold text-heading text-sm">{v.name}</p>
                                <p className="text-[11px] text-muted">{v.email}</p>
                              <p className="text-[10px] text-blue-500 font-semibold mt-0.5">{v.mobile || "No mobile"} • Joined {new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => { 
                                 setPromptText("");
                                 setRejectPromptModal({ id: v.id, name: v.name, type: "VENDOR_KYC" });
                              }}
                              className="px-4 py-2 border-2 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleOpenVendorModal(v)}
                              className="px-4 py-2 bg-surface border border-border hover:border-blue-500 text-xs font-bold rounded-xl transition-colors"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => { if(confirm(`Approve ${v.name} as a verified vendor?`)) { handleReviewVendor(v.id, "APPROVE"); } }}
                              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                            >
                              ✓ Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ===== SECTION 2: ALL REGISTERED VENDORS ===== */}
                <div>
                  <h3 className="text-base font-black text-heading mb-4 flex items-center gap-2">
                    <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" /> All Registered Vendors
                    <span className="ml-1 text-xs font-semibold text-muted">({vendors.length} total)</span>
                  </h3>
                  {vendors.length === 0 ? (
                    <p className="text-center p-8 bg-surface-card rounded-2xl text-muted text-sm">No vendors registered yet.</p>
                  ) : (
                    <div className="bg-surface-card border border-border rounded-2xl shadow-sm">
                      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="sticky top-0 z-10">
                            <tr className="bg-surface text-muted border-b border-border shadow-sm">
                              <th className="p-4 font-bold uppercase tracking-wider">Vendor Name</th>
                              <th className="p-4 font-bold uppercase tracking-wider">Contact</th>
                              <th className="p-4 font-bold uppercase tracking-wider">Joined</th>
                              <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                              <th className="p-4 font-bold uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {vendors.map(v => (
                              <tr key={v.id} className={`hover:bg-surface-hover transition-colors ${v.vendorStatus === "IN_REVIEW" ? "bg-blue-500/[0.03]" : ""}`}>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black uppercase shrink-0
                                      ${v.vendorStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                                        v.vendorStatus === "IN_REVIEW" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                                        v.vendorStatus === "REJECTED" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                        "bg-surface border border-border text-muted"}`}>
                                      {v.name?.charAt(0) || "V"}
                                    </div>
                                    <div>
                                      <p className="font-bold text-heading flex items-center gap-1.5">
                                        {v.name}
                                        {v.vendorStatus === "APPROVED" && <CheckCircle size={12} className="text-emerald-500" />}
                                        {v.vendorStatus === "IN_REVIEW" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <p className="text-muted">{v.email}</p>
                                  <p className="font-mono text-[10px] text-muted">{v.mobile || "N/A"}</p>
                                </td>
                                <td className="p-4 text-muted">{new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                    v.vendorStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                                    v.vendorStatus === "REJECTED" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                    v.vendorStatus === "IN_REVIEW" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                                    "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                  }`}>
                                    {v.vendorStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => handleOpenVendorModal(v)} className="px-3 py-1.5 bg-surface border border-border hover:border-orange-500 text-xs font-bold rounded-lg transition-colors">
                                      View
                                    </button>
                                    <a href={`/admin/vendor-shop/${v.id}`} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors">
                                      Catalog
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                  )}
                </div>
             </div>
  );
}
