"use client";

import React from "react";

interface InquiriesTabProps {
  stats: any;
  inquiries: any[];
  products: any[];
  editingDelivery: any;
  setEditingDelivery: any;
  handleUpdateItemStatus: any;
  formatDateTime: any;
  setModalMessage: (msg: any) => void;
  openProductModal: (prod: any) => void;
}

export default function InquiriesTab({
  stats,
  inquiries,
  products,
  editingDelivery,
  setEditingDelivery,
  handleUpdateItemStatus,
  formatDateTime,
  setModalMessage,
  openProductModal,
}: InquiriesTabProps) {
  return (
    <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300 relative">
      <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/70 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            Active Orders & Production Pipeline
          </h3>
          <p className="text-[10px] text-muted mt-0.5">Real-time status updates and order tracking</p>
        </div>
      </div>
      
      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-surface/50 border-b border-border/80">
        {/* Today's Orders */}
        <div className="bg-gradient-to-br from-orange-500/[0.04] to-transparent dark:from-orange-500/[0.08] border border-orange-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-orange-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Received Today</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.todayOrders}</span>
            <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 text-orange-500 rounded-md font-bold uppercase tracking-wider">Today</span>
          </div>
        </div>

        {/* Active Quote Requests */}
        <div className="bg-gradient-to-br from-blue-500/[0.04] to-transparent dark:from-blue-500/[0.08] border border-blue-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-blue-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Pending Quotes</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.activeQuotes}</span>
            <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-500 rounded-md font-bold uppercase tracking-wider">Inquiries</span>
          </div>
        </div>

        {/* Total Orders Received */}
        <div className="bg-gradient-to-br from-purple-500/[0.04] to-transparent dark:from-purple-500/[0.08] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-purple-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Orders</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.totalReceived}</span>
            <span className="px-2 py-0.5 text-[9px] bg-purple-500/10 text-purple-500 rounded-md font-bold uppercase tracking-wider">All-Time</span>
          </div>
        </div>

        {/* Completed / Delivered */}
        <div className="bg-gradient-to-br from-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.08] border border-emerald-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Delivered</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.deliveredCount}</span>
            <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-500 rounded-md font-bold uppercase tracking-wider">Shipped</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
              <th className="px-5 py-4 font-bold">Date</th>
              <th className="px-5 py-4 font-bold min-w-[180px]">Buyer Details</th>
              <th className="px-5 py-4 font-bold min-w-[200px]">Product Requested</th>
              <th className="px-5 py-4 font-bold text-center">Order Type</th>
              <th className="px-5 py-4 font-bold text-center min-w-[210px]">Current Stage</th>
              <th className="px-5 py-4 font-bold text-center">Buyer Message</th>
              <th className="px-5 py-4 font-bold text-right min-w-[280px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {(() => {
              let activeCount = 0;
              const rows = inquiries.flatMap((inq) => {
                let parsedItems: any[] = [];
                try {
                  parsedItems = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
                } catch (e) {}
                const itemsList = parsedItems.filter((item: any) =>
                  products.some((p) => String(p.id) === String(item.id))
                );
                
                return itemsList.map((item: any, idx: number) => {
                  const originalProduct = products.find((p) => String(p.id) === String(item.id));
                  const imgUrl = originalProduct?.image || item.image || "/logo4.jpg";
                  const currentStatus = item.status || "PENDING";
                  
                  // Filter out archive states
                  if (["DELIVERED", "CANCELLED", "RETURNED"].includes(currentStatus)) {
                    return null;
                  }
                  
                  activeCount++;
                  return (
                    <tr key={`${inq.id}-${item.id}-${idx}`} className="hover:bg-orange-500/[0.03] transition-all duration-200 text-body align-middle group/row">
                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-muted font-semibold text-[11px]">
                        {new Date(inq.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      
                      {/* Buyer Details */}
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5 max-w-[260px] min-w-[160px]">
                          <span className="font-bold text-heading text-xs tracking-tight">{inq.name}</span>
                          <span className="text-[10px] text-muted font-medium flex items-center gap-1">
                            📍 {inq.country || "Domestic"} {inq.companyName ? `| ${inq.companyName}` : ""}
                          </span>
                          <span className="text-[10px] text-muted/80 truncate">✉️ {inq.email}</span>
                          <span className="text-[10px] text-muted/80">📞 {inq.phone}</span>
                        </div>
                      </td>
                      
                      {/* Product Requested */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/60 bg-white flex-shrink-0 relative shadow-sm">
                            <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                            <span className="font-bold text-heading text-xs truncate" title={originalProduct?.name || item.name}>
                              {originalProduct?.name || item.name}
                            </span>
                            <div className="flex gap-1.5 items-center mt-0.5">
                              <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">#{item.id}</span>
                              <span className="text-[10px] text-muted font-medium">{originalProduct?.material || item.material || "Bronze"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Order Type */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className={`inline-block whitespace-nowrap text-[10px] font-bold px-2.5 py-1 rounded-full ${(item.orderType || "Bulk Order") === "Single Item" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"}`}>
                          {item.orderType || "Bulk Order"}
                        </span>
                      </td>
                      
                      {/* Current Stage */}
                      <td className="p-4 text-center min-w-[210px]">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                            currentStatus === "PENDING" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/25" :
                            currentStatus === "PACKED" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25" :
                            "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25"
                          }`}>
                            {currentStatus === "PENDING" ? "Inquiry / Pending" : currentStatus}
                          </span>
                          
                          {["PACKED", "DISPATCHED"].includes(currentStatus) && (
                            <div className="w-full max-w-[190px] flex flex-col items-center gap-1.5 animate-in fade-in duration-200">
                              {editingDelivery && editingDelivery.inquiryId === inq.id && editingDelivery.productId === item.id ? (
                                <div className="flex flex-col gap-1.5 w-full bg-surface-card border border-border p-2.5 rounded-2xl shadow-xl z-15 relative">
                                  <span className="text-[8px] text-muted font-bold uppercase tracking-wider block text-left">Set Est. Delivery:</span>
                                  <input
                                    type="datetime-local"
                                    min={(() => {
                                      const now = new Date();
                                      const tzOffset = now.getTimezoneOffset() * 60000;
                                      return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
                                    })()}
                                    value={editingDelivery.value}
                                    onChange={(e) => setEditingDelivery(editingDelivery ? { ...editingDelivery, value: e.target.value } : null)}
                                    className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-[10px] text-heading font-medium outline-none focus:border-orange-500 transition-colors"
                                  />
                                  <div className="flex gap-1.5 justify-end mt-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingDelivery(null)}
                                      className="px-2 py-1 text-[9px] text-muted hover:text-heading bg-surface hover:bg-surface-hover border border-border rounded-lg font-semibold transition-all"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (editingDelivery) {
                                          handleUpdateItemStatus(inq.id, item.id, currentStatus, editingDelivery.value);
                                          setEditingDelivery(null);
                                        }
                                      }}
                                      className="px-2.5 py-1 text-[9px] text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition-all shadow-sm shadow-orange-500/10"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1 w-full">
                                  {item.deliveryDate ? (
                                    <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[8px] text-muted font-bold uppercase tracking-wider">Est. Delivery:</span>
                                      <span className="text-[10px] text-heading font-semibold bg-surface border border-border px-2 py-0.5 rounded-lg whitespace-nowrap">
                                        {formatDateTime(item.deliveryDate)}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setEditingDelivery({ 
                                          inquiryId: inq.id, 
                                          productId: item.id, 
                                          value: item.deliveryDate ? new Date(item.deliveryDate).toISOString().slice(0, 16) : "" 
                                        })}
                                        className="mt-1 text-[9px] text-orange-500 hover:text-orange-600 font-bold transition-colors underline"
                                      >
                                        Change Date
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setEditingDelivery({ inquiryId: inq.id, productId: item.id, value: "" })}
                                      className="w-full py-1.5 px-3 text-[10px] font-bold text-orange-500 border border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5 rounded-lg transition-all shadow-sm"
                                    >
                                      Set Delivery Date
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Message */}
                      <td className="p-4 text-center">
                        <button type="button" onClick={() => setModalMessage(inq)} className="px-3 py-1.5 text-xs bg-surface hover:bg-surface-hover text-heading border border-border rounded-xl font-bold transition-all shadow-sm">
                          Read
                        </button>
                      </td>
                      
                      {/* Action Pipeline */}
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        {originalProduct && (
                          <>
                            <button type="button" onClick={() => openProductModal(originalProduct)} className="px-3 py-1.5 text-[10px] text-orange-500 hover:text-white border border-orange-500/20 hover:bg-orange-500 rounded-xl transition-all duration-200 font-bold shadow-sm hover:shadow-md hover:shadow-orange-500/10">
                              Details
                            </button>
                            {currentStatus === "PENDING" && (
                              <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "PACKED")} className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold shadow-sm shadow-blue-500/10 transition-all duration-200">
                                Start Packing
                              </button>
                            )}
                            {currentStatus === "PACKED" && (
                              <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "DISPATCHED")} className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl font-bold shadow-sm shadow-orange-500/10 transition-all duration-200">
                                Dispatch
                              </button>
                            )}
                            {currentStatus === "DISPATCHED" && (
                              <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "DELIVERED")} className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl font-bold shadow-sm shadow-emerald-500/10 transition-all duration-200">
                                Mark Delivered
                              </button>
                            )}
                            <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "CANCELLED")} className="px-3 py-1.5 text-[10px] text-red-500 hover:text-white border border-red-500/20 hover:bg-red-500 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-red-500/10">
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                });
              });
              
              if (activeCount === 0) {
                return (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-muted text-sm">No active orders found.</td>
                  </tr>
                );
              }
              return rows;
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
