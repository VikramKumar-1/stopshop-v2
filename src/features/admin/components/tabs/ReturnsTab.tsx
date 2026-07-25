"use client";
import React from "react";
import { Package, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

export function ReturnsTab({
  returns,
  settings,
  currentTime,
  processingReturns,
  getReturnThumb,
  handleUpdateReturn,
  showToast,
  setConfirmModal,
}: {
  returns: any[];
  settings: any;
  currentTime: Date;
  processingReturns: Record<string, boolean>;
  getReturnThumb: (r: any) => string;
  handleUpdateReturn: (id: string, action: string, rejectionReason?: string, banUser?: boolean, banVendor?: boolean, adminNotes?: string) => void;
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  setConfirmModal: (val: any) => void;
}) {
  const [expandedAuditId, setExpandedAuditId] = React.useState<string | null>(null);
  return (
              <div className="space-y-6">
                 {returns.filter(r => r.status === "PENDING" || r.status === "RECEIVED_AT_WAREHOUSE" || (r.status === "APPROVED" && r.vendorDeliveredAt)).length === 0 ? <p className="text-center p-8 bg-surface-card rounded-2xl text-muted text-sm">No active return requests.</p> : null}
                 
                 {/* PRE-PICKUP APPROVALS */}
                 {returns.filter(r => r.status === "PENDING").length > 0 && <h3 className="text-sm font-bold text-heading mt-4 border-b border-border pb-2">New Return Requests (Needs Pickup Approval)</h3>}
                 {returns.filter(r => r.status === "PENDING").map(r => (
                    <div key={r.id} className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                       <div className="flex gap-3 items-center mb-4">
                          <img src={getReturnThumb(r)} alt="Product" className="w-10 h-10 object-cover rounded-lg border border-border bg-surface shadow-sm" />
                          <span className="font-bold text-heading text-sm">Return #{r.id}</span>
                          <span className="bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-500/20">{r.status}</span>
                          <span className="text-xs text-muted ml-auto">Order: <strong className="text-heading">{r.order.orderNumber}</strong></span>
                       </div>
                       <p className="text-xs text-muted mb-4 bg-surface p-3 rounded-xl border border-border">User Reason: <strong className="text-heading">{r.reason}</strong> - {r.reasonDetail}</p>
                       
                       <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                             <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Vendor Dispatch Photos (Genuine)</h4>
                             <div className="flex flex-wrap">
                                {r.order?.items?.flatMap((i:any) => {
                                    const imgs = i.dispatchImages;
                                    if (!imgs) return [];
                                    if (typeof imgs === "string") {
                                       try { return JSON.parse(imgs); } catch(e) { return []; }
                                    }
                                    return Array.isArray(imgs) ? imgs : [];
                                 }).slice(0, 4).map((img:string, i:number) => (
                                    <img key={i} src={img} alt="Dispatch Proof" className="w-20 h-20 object-cover rounded-lg border-2 border-emerald-500/30" />
                                 ))}
                             </div>
                          </div>
                          <div>
                             <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">User Return Photos (Claimed Issue)</h4>
                             <div className="flex flex-wrap gap-2">
                                {(r.returnImages as string[] || []).map((img, i) => (
                                   <img key={i} src={img} alt="Return Evidence" className="w-20 h-20 object-cover rounded-lg border-2 border-red-500/30" />
                                ))}
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex gap-3 w-full justify-end border-t border-border pt-4">
                          <span className="text-xs font-bold text-emerald-500 px-3 py-2 bg-emerald-500/10 rounded-xl">Auto-Pickup Scheduled</span>
                       </div>
                    </div>
                 ))}

                 {/* ACTIVE QC SLA TIMER SECTION */}
                 {returns.filter(r => r.status === "APPROVED" && r.vendorDeliveredAt).length > 0 && (
                    <div className="space-y-4 mt-6">
                       <h3 className="text-sm font-bold text-heading border-b border-border pb-2">Returns Under Vendor QC Check (SLA Countdown)</h3>
                       {returns.filter(r => r.status === "APPROVED" && r.vendorDeliveredAt).map(r => (
                          <div key={r.id} className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                             <div className="flex gap-3 items-center mb-4">
                                <span className="font-bold text-heading text-sm">Return #{r.id}</span>
                                <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-500/20">QC IN PROGRESS</span>
                                <span className="text-xs text-muted ml-auto">Order: <strong className="text-heading">{r.order.orderNumber}</strong></span>
                             </div>
                             
                             {/* SLA COUNTDOWN TIMER */}
                             <div className="mb-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-pulse">
                                <div className="flex items-center gap-2">
                                   <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                   </span>
                                   <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Remaining Vendor SLA:</span>
                                </div>
                                <span className="text-xs font-black text-orange-700 font-mono bg-orange-500/5 px-2.5 py-1 rounded-lg border border-orange-500/10">
                                   {(() => {
                                      const deliveredAt = new Date(r.vendorDeliveredAt);
                                      const deadline = new Date(deliveredAt.getTime() + (settings?.vendorReturnSlaHours || 24) * 60 * 60 * 1000);
                                      const diffMs = deadline.getTime() - currentTime.getTime();
                                      if (diffMs <= 0) {
                                         return "SLA EXPIRED (Auto-refund pending)";
                                      }
                                      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                      return `${diffHours}h ${diffMins}m remaining`;
                                   })()}
                                </span>
                             </div>
                             
                             <div className="flex justify-between items-center text-xs text-muted">
                                <span>Delivered to Vendor at: {new Date(r.vendorDeliveredAt).toLocaleString()}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}

                 {/* DISPUTES (QC FAILED) */}
                 {returns.filter(r => r.status === "RECEIVED_AT_WAREHOUSE").length > 0 && <h3 className="text-sm font-bold text-red-500 mt-10 border-b border-border pb-2">Disputes: Vendor Flagged Fake Return</h3>}
                 {returns.filter(r => r.status === "RECEIVED_AT_WAREHOUSE").map(r => (
                    <div key={r.id} className="bg-surface-card border-2 border-red-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden mt-6">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -z-10" />
                       
                       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 pb-4 border-b border-border">
                          <div>
                             <div className="flex gap-3 items-center mb-1">
                                <span className="font-bold text-heading text-lg">Disputed Return #{r.id}</span>
                                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm animate-pulse">ACTION REQUIRED</span>
                             </div>
                             <span className="text-xs text-muted">Order: <strong className="text-heading">{r.order.orderNumber}</strong></span>
                          </div>
                          <div className="bg-red-500/5 px-4 py-3 rounded-xl border border-red-500/20">
                             <p className="text-xs text-muted mb-1 font-bold uppercase text-red-500">Vendor QC Notes:</p>
                             <p className="text-sm font-medium text-heading">{r.qcNotes}</p>
                          </div>
                       </div>
                       
                       {/* EVIDENCE COMPARISON GRID */}
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                          {/* 1. Original Product */}
                          <div className="bg-surface p-4 rounded-xl border border-border">
                             <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1"><Package size={14}/> Original Product</h4>
                             {r.order?.items?.slice(0, 1).map((item: any, idx: number) => (
                                <div key={idx} className="flex flex-col gap-2">
                                   <a href={`/product/${item.product?.id}`} target="_blank" rel="noreferrer" className="block w-full aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary transition-colors">
                                      <img src={item.productImage || item.product?.image || "/placeholder.jpg"} alt="Original Product" className="w-full h-full object-cover" />
                                   </a>
                                   <div>
                                      <p className="text-xs font-bold text-heading line-clamp-2 leading-tight">{item.product?.name || item.productName}</p>
                                      <p className="text-[10px] text-muted mt-1">₹{(item.unitPaise / 100).toLocaleString()} x {item.quantity}</p>
                                   </div>
                                </div>
                             ))}
                          </div>

                          {/* 2. Vendor Dispatch Evidence */}
                          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                             <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1"><CheckCircle2 size={14}/> Vendor Dispatch</h4>
                             <div className="flex flex-wrap">
                                 {(() => {
                                    const allImgs = r.order?.items?.flatMap((i:any) => {
                                       const imgs = i.dispatchImages;
                                       if (!imgs) return [];
                                       if (typeof imgs === "string") {
                                          try { return JSON.parse(imgs); } catch(e) { return []; }
                                       }
                                       return Array.isArray(imgs) ? imgs : [];
                                    }) || [];
                                    
                                    if (allImgs.length > 0) {
                                       return allImgs.slice(0, 4).map((img:string, i:number) => (
                                          <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 block">
                                             <img src={img} alt="Dispatch Proof" className="w-full h-full object-cover rounded-lg border border-emerald-500/30 hover:border-emerald-500 transition-colors" />
                                          </a>
                                       ));
                                    }
                                    return <p className="text-[10px] text-muted italic">No dispatch photos available</p>;
                                 })()}
                             </div>
                          </div>

                          {/* 3. User Claim Evidence */}
                          <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20">
                             <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-1"><AlertTriangle size={14}/> User Claim</h4>
                             <p className="text-[10px] font-medium text-heading mb-2 bg-orange-500/10 px-2 py-1 rounded line-clamp-2">"{r.reasonDetail}"</p>
                             <div className="flex flex-wrap gap-2">
                                {(r.returnImages as string[] || []).map((img, i) => (
                                   <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 block">
                                      <img src={img} alt="Return Evidence" className="w-full h-full object-cover rounded-lg border border-orange-500/30 hover:border-orange-500 transition-colors" />
                                   </a>
                                ))}
                             </div>
                          </div>

                          {/* 4. Vendor QC Proof */}
                          <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                             <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-1"><XCircle size={14}/> Vendor QC Proof</h4>
                             <div className="flex flex-wrap gap-2">
                                {(r.qcImages as string[] || []).map((img, i) => (
                                   <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 block">
                                      <img src={img} alt="Vendor QC Proof" className="w-full h-full object-cover rounded-lg border border-red-500/50 hover:border-red-500 transition-colors" />
                                   </a>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* RESOLUTION SECTION */}
                       <div className="bg-surface p-5 rounded-xl border border-border">
                          <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-3">Admin Resolution</h4>
                          <textarea 
                             id={`admin_notes_${r.id}`} 
                             placeholder="Write resolution notes to send to the user and vendor explaining your decision..."
                             className="w-full p-3 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-heading mb-4 min-h-[80px]"
                          />

                          <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">
                             <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors border border-red-500/10">
                                   <input type="checkbox" id={`ban_user_${r.id}`} className="rounded border-red-500/50 text-red-500 focus:ring-red-500 bg-black/20" />
                                   BAN USER
                                </label>
                                <label className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors border border-red-500/10">
                                   <input type="checkbox" id={`ban_vendor_${r.id}`} className="rounded border-red-500/50 text-red-500 focus:ring-red-500 bg-black/20" />
                                   BAN VENDOR
                                </label>
                             </div>
                             <div className="flex gap-3">
                                <button onClick={() => {
                                   const banUser = (document.getElementById(`ban_user_${r.id}`) as HTMLInputElement)?.checked;
                                   const banVendor = (document.getElementById(`ban_vendor_${r.id}`) as HTMLInputElement)?.checked;
                                   const adminNotes = (document.getElementById(`admin_notes_${r.id}`) as HTMLTextAreaElement)?.value;
                                   if (!adminNotes) return showToast("Please add resolution notes before proceeding.", "error");
                                   setConfirmModal({
                                      title: "Refund User",
                                      message: "Are you sure you want to refund the user? The vendor will NOT be paid.",
                                      confirmText: "Refund User",
                                      action: () => handleUpdateReturn(r.id, "QC_PASS", undefined, banUser, banVendor, adminNotes)
                                   });
                                }} disabled={processingReturns[r.id]} className={`px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-500 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${processingReturns[r.id] ? "opacity-50 cursor-not-allowed" : ""}`}>
                                   {processingReturns[r.id] ? "Processing..." : "Side with User (Refund)"}
                                </button>
                                
                                <button onClick={() => {
                                   const banUser = (document.getElementById(`ban_user_${r.id}`) as HTMLInputElement)?.checked;
                                   const banVendor = (document.getElementById(`ban_vendor_${r.id}`) as HTMLInputElement)?.checked;
                                   const adminNotes = (document.getElementById(`admin_notes_${r.id}`) as HTMLTextAreaElement)?.value;
                                   if (!adminNotes) return showToast("Please add resolution notes before proceeding.", "error");
                                   setConfirmModal({
                                      title: "Pay Vendor",
                                      message: "Are you sure you want to pay the vendor? The user will NOT be refunded.",
                                      confirmText: "Pay Vendor",
                                      action: () => handleUpdateReturn(r.id, "QC_FAIL", undefined, banUser, banVendor, adminNotes)
                                   });
                                }} disabled={processingReturns[r.id]} className={`px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm shadow-red-500/20 ${processingReturns[r.id] ? "opacity-50 cursor-not-allowed" : ""}`}>
                                   {processingReturns[r.id] ? "Processing..." : "Side with Vendor (Reject Refund)"}
                                </button>
                             </div>
                          </div>
                       </div>
                     </div>
                  ))}

                  {/* FAILED REFUNDS (ACTION REQUIRED) */}
                  {returns.filter(r => r.status === "REFUND_FAILED").length > 0 && <h3 className="text-sm font-bold text-red-500 mt-10 border-b border-border pb-2">Failed Refunds (Action Required)</h3>}
                  {returns.filter(r => r.status === "REFUND_FAILED").map(r => (
                     <div key={r.id} className="bg-surface-card border-2 border-red-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden mt-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -z-10" />
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                           <div>
                              <div className="flex gap-3 items-center mb-1">
                                 <span className="font-bold text-heading text-lg">Return #{r.id}</span>
                                 <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm animate-pulse">REFUND FAILED</span>
                              </div>
                              <span className="text-xs text-muted">Order: <strong className="text-heading">{r.order.orderNumber}</strong> ({r.order.paymentGateway})</span>
                           </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                           <h4 className="text-xs font-bold text-red-600 uppercase mb-1 flex items-center gap-2">
                              <AlertTriangle size={16} /> System Error / Admin Note
                           </h4>
                           <p className="text-sm font-medium text-red-700">{r.adminNotes || "Unknown error occurred during refund."}</p>
                           <p className="text-[10px] text-red-500/80 mt-2">The background cron job will automatically retry this every hour. If it's a balance issue, please add funds to your gateway account and click Retry.</p>
                        </div>

                        <div className="flex justify-end border-t border-border pt-4">
                           <button 
                              onClick={async (e) => {
                                 const btn = e.currentTarget;
                                 btn.disabled = true;
                                 btn.innerText = "Retrying...";
                                 try {
                                    const res = await fetch("/api/returns/admin/retry-refund", {
                                       method: "POST",
                                       headers: { "Content-Type": "application/json" },
                                       body: JSON.stringify({ returnId: r.id })
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                       showToast("Refund initiated successfully!", "success");
                                       setTimeout(() => window.location.reload(), 1000);
                                    } else {
                                       showToast(data.error || "Retry failed again", "error");
                                       btn.disabled = false;
                                       btn.innerText = "Retry Refund Now";
                                    }
                                 } catch (err) {
                                    showToast("Network error", "error");
                                    btn.disabled = false;
                                    btn.innerText = "Retry Refund Now";
                                 }
                              }} 
                              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-red-500/30 flex items-center gap-2"
                           >
                              Retry Refund Now
                           </button>
                        </div>
                     </div>
                  ))}

                  {/* RESOLVED / RETURN HISTORY (AUDIT TRAIL) */}
                  {returns.filter(r => r.status === "REFUNDED" || r.status === "REJECTED" || r.status === "COMPLETED").length > 0 && (
                   <div className="space-y-4 mt-8 pt-6 border-t-2 border-dashed border-border">
                      <div className="flex justify-between items-center">
                         <div>
                            <h3 className="text-sm font-bold text-heading">📜 Resolved / Return History (Audit Trail)</h3>
                            <p className="text-[10px] text-muted">Retained for 60-day customer care compliance and audit reviews</p>
                         </div>
                         <span className="text-[10px] bg-surface px-2.5 py-1 rounded-lg border border-border font-bold text-muted">
                            {returns.filter(r => r.status === "REFUNDED" || r.status === "REJECTED" || r.status === "COMPLETED").length} Resolved
                         </span>
                      </div>

                      {returns.filter(r => r.status === "REFUNDED" || r.status === "REJECTED" || r.status === "COMPLETED").map(r => (
                         <div key={r.id} className="bg-surface-card/60 border border-border/80 rounded-2xl p-5 shadow-sm transition-all">
                            <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
                               <div className="flex gap-3 items-center">
                                  <img src={getReturnThumb(r)} alt="Product" className="w-9 h-9 object-cover rounded-lg border border-border bg-surface shrink-0" />
                                  <div>
                                     <span className="font-bold text-heading text-xs">Return #{r.id}</span>
                                     <span className="text-[10px] text-muted block">Order #{r.order?.orderNumber || "N/A"}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                                    r.status === "REFUNDED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
                                  }`}>
                                     {r.status === "REFUNDED" ? "REFUNDED (Sided with User)" : "REJECTED (Sided with Vendor)"}
                                  </span>
                                  <button
                                     onClick={() => setExpandedAuditId(expandedAuditId === r.id ? null : r.id)}
                                     className="px-3 py-1 text-[10px] font-bold bg-surface hover:bg-border/50 text-heading rounded-lg border border-border transition-colors"
                                  >
                                     {expandedAuditId === r.id ? "Hide Audit Proofs" : "View Audit Proofs"}
                                  </button>
                               </div>
                            </div>

                            {r.adminNotes && (
                               <div className="bg-surface p-3 rounded-xl border border-border/60 text-xs text-muted mb-2">
                                  <strong className="text-heading font-semibold">Admin Resolution Note:</strong> {r.adminNotes}
                               </div>
                            )}

                            {expandedAuditId === r.id && (
                               <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-200">
                                  {/* Dispatch Proofs */}
                                  <div className="bg-surface p-3 rounded-xl border border-border/60">
                                     <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">1. Dispatch Proof</span>
                                     <div className="flex flex-wrap gap-2">
                                        {(() => {
                                           const imgs = r.order?.items?.flatMap((i:any) => {
                                              const d = i.dispatchImages;
                                              if (!d) return [];
                                              if (typeof d === "string") { try { return JSON.parse(d); } catch(e) { return []; } }
                                              return Array.isArray(d) ? d : [];
                                           }) || [];
                                           if (imgs.length === 0) return <span className="text-[10px] text-muted italic">No photos recorded</span>;
                                           return imgs.map((img:string, i:number) => (
                                              <a key={i} href={img} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-lg overflow-hidden border border-border block">
                                                 <img src={img} alt="Dispatch" className="w-full h-full object-cover" />
                                              </a>
                                           ));
                                        })()}
                                     </div>
                                  </div>

                                  {/* User Claim Proofs */}
                                  <div className="bg-surface p-3 rounded-xl border border-border/60">
                                     <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-2">2. User Claim Proof</span>
                                     <div className="flex flex-wrap gap-2">
                                        {(r.returnImages as string[] || []).length === 0 ? (
                                           <span className="text-[10px] text-muted italic">No photos recorded</span>
                                        ) : (
                                           (r.returnImages as string[]).map((img, i) => (
                                              <a key={i} href={img} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-lg overflow-hidden border border-border block">
                                                 <img src={img} alt="Claim" className="w-full h-full object-cover" />
                                              </a>
                                           ))
                                        )}
                                     </div>
                                  </div>

                                  {/* Vendor QC Proofs */}
                                  <div className="bg-surface p-3 rounded-xl border border-border/60">
                                     <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-2">3. Vendor QC Proof</span>
                                     <div className="flex flex-wrap gap-2">
                                        {(r.qcImages as string[] || []).length === 0 ? (
                                           <span className="text-[10px] text-muted italic">No QC dispute photos</span>
                                        ) : (
                                           (r.qcImages as string[]).map((img, i) => (
                                              <a key={i} href={img} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-lg overflow-hidden border border-border block">
                                                 <img src={img} alt="QC" className="w-full h-full object-cover" />
                                              </a>
                                           ))
                                        )}
                                     </div>
                                  </div>
                               </div>
                            )}
                         </div>
                      ))}
                   </div>
                  )}
               </div>
  );
}
