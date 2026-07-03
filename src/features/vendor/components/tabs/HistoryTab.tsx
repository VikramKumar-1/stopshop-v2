"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface HistoryTabProps {
  dashboardStats: any;
  inquiries: any[];
  products: any[];
  directOrders: any[];
  orderPage: number;
  orderTotalPages: number;
  loadMoreRef: any;
  setModalMessage: (msg: any) => void;
  openProductModal: (prod: any) => void;
  setModalShipping: (order: any) => void;
  setModalTransaction: (order: any) => void;
}

export default function HistoryTab({
  dashboardStats,
  inquiries,
  products,
  directOrders,
  orderPage,
  orderTotalPages,
  loadMoreRef,
  setModalMessage,
  openProductModal,
  setModalShipping,
  setModalTransaction,
}: HistoryTabProps) {
  return (
    <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-zinc-500/5 via-transparent to-transparent border-b border-border/70 px-6 py-4">
        <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider">Order History</h3>
        <p className="text-[10px] text-muted mt-0.5">Completed, returned, and cancelled order records</p>
      </div>
      <div className="grid grid-cols-3 gap-4 p-4 bg-surface/50 border-b border-border/80 text-xs">
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Delivered</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">
              {dashboardStats ? dashboardStats.delivered : "..."}
            </span>
            <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-600 rounded-md font-bold uppercase">Success</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Returned</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">
              {dashboardStats ? dashboardStats.returned : "..."}
            </span>
            <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-600 rounded-md font-bold uppercase">Returns</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Cancelled / Rejected</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-display text-heading tracking-tight">
              {dashboardStats ? dashboardStats.cancelled : "..."}
            </span>
            <span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-500 rounded-md font-bold uppercase">Lost</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold min-w-[180px]">Buyer Details</th>
              <th className="p-4 font-bold min-w-[200px]">Product Requested</th>
              <th className="p-4 font-bold text-center">Order Type</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold">Notes</th>
              <th className="p-4 font-bold text-right min-w-[200px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-muted">
            {(() => {
              let historyCount = 0;
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
                  
                  // Show only history states
                  if (!["DELIVERED", "CANCELLED", "RETURNED", "RETURN_REJECTED"].includes(currentStatus)) {
                    return null;
                  }
                  
                  historyCount++;
                  return (
                    <tr key={`${inq.id}-${item.id}-${idx}`} className="hover:bg-surface-hover/40 transition-all duration-200 align-middle">
                      {/* Date */}
                      <td className="p-4 whitespace-nowrap font-medium">
                        {new Date(inq.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      {/* Buyer Details */}
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5 max-w-[260px] min-w-[160px] text-muted/80">
                          <span className="font-bold text-muted text-xs">{inq.name}</span>
                          <span className="text-[10px] flex items-center gap-1">📍 {inq.country || "Domestic"}</span>
                          <span className="text-[10px] truncate">✉️ {inq.email}</span>
                        </div>
                      </td>
                      
                      {/* Product Requested */}
                      <td className="p-4">
                        <div className="flex items-center gap-3 opacity-70">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0 relative">
                            <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                            <span className="font-bold text-muted text-xs truncate" title={originalProduct?.name || item.name}>
                              {originalProduct?.name || item.name}
                            </span>
                            <span className="text-[9px] font-mono">#{item.id}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Order Type */}
                      <td className="p-4 text-center opacity-70 whitespace-nowrap">
                        <span className="inline-block whitespace-nowrap text-[10px] font-medium border border-border px-2.5 py-1 rounded-full">
                          {item.orderType || "Bulk Order"}
                        </span>
                      </td>
                      
                      {/* Status */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                            currentStatus === "DELIVERED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                            currentStatus === "RETURNED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                            "bg-red-500/5 text-red-500 border-red-500/20"
                          }`}>
                            {currentStatus}
                          </span>
                          {currentStatus === "DELIVERED" && item.deliveryDate && (
                            <span className="text-[8px] text-muted font-semibold mt-0.5">
                              Delivered: {new Date(item.deliveryDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Notes */}
                      <td className="p-4 text-center">
                        <button type="button" onClick={() => setModalMessage(inq)} className="px-3 py-1.5 text-xs bg-surface hover:bg-surface-hover text-heading border border-border rounded-xl font-bold transition-all shadow-sm">
                          Read
                        </button>
                      </td>
                      
                      {/* Action */}
                      <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                        {originalProduct && (
                          <>
                            <button type="button" onClick={() => openProductModal(originalProduct)} className="px-2 py-1 text-[10px] text-muted hover:text-heading border border-border hover:bg-surface rounded-lg font-bold">
                              View Product
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                });
              });
              
              const directRows = directOrders.map((order) => {
                const currentStatus = order.status || "PENDING";
                if (!["DELIVERED", "CANCELLED", "RETURNED", "RETURN_REJECTED"].includes(currentStatus)) {
                  return null;
                }
                
                historyCount++;
                return (
                  <tr key={order.id} className="hover:bg-surface-hover/40 transition-all duration-200 align-middle">
                    <td className="p-4 whitespace-nowrap font-medium text-muted font-semibold text-[11px]">
                      {new Date(order.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 max-w-[200px] min-w-[150px] opacity-80">
                        <div>
                          <span className="font-bold text-heading text-xs tracking-tight block">{order.shippingName}</span>
                          <span className="text-[10px] text-muted font-medium">📍 {order.shippingCity}, {order.shippingState}</span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <button 
                            type="button"
                            onClick={() => setModalShipping(order)}
                            className="text-[9px] text-orange-500 border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-md font-bold transition-colors w-fit text-left"
                          >
                            View Shipping Details
                          </button>
                          <button 
                            type="button"
                            onClick={() => setModalTransaction(order)}
                            className="text-[9px] text-muted hover:text-heading border border-border hover:bg-surface-hover px-2 py-1 rounded-md font-bold transition-colors w-fit text-left"
                          >
                            Transaction Details
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-3 opacity-70">
                        {order.items && order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0 relative">
                              <img src={item.productImage || "/logo4.jpg"} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                              <span className="font-bold text-muted text-xs truncate" title={item.productName}>
                                {item.productName}
                              </span>
                              <span className="text-[9px] font-mono">Qty: {item.quantity}</span>
                              <button 
                                type="button" 
                                onClick={() => {
                                  const prod = products.find(p => p.id === item.productId);
                                  if (prod) openProductModal(prod);
                                }}
                                className="text-[9px] text-blue-500 hover:text-blue-600 font-bold self-start mt-0.5 underline"
                              >
                                View Product
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center opacity-70 whitespace-nowrap">
                      <span className="inline-block whitespace-nowrap text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full">
                        Buy Now
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          currentStatus === "DELIVERED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                          currentStatus === "RETURNED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                          "bg-red-500/5 text-red-500 border-red-500/20"
                        }`}>
                          {currentStatus}
                        </span>
                        {currentStatus === "DELIVERED" && (
                          <div className="flex items-center gap-1 my-1 justify-center">
                            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold bg-orange-500 text-white" title="Ordered">O</div>
                            <div className="w-3 h-[2px] bg-orange-500" />
                            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold bg-orange-500 text-white" title="Packed">P</div>
                            <div className="w-3 h-[2px] bg-orange-500" />
                            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold bg-orange-500 text-white" title="Dispatched">S</div>
                            <div className="w-3 h-[2px] bg-orange-500" />
                            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold bg-orange-500 text-white" title="Delivered">D</div>
                          </div>
                        )}
                        {currentStatus === "DELIVERED" && (order.deliveredAt || order.deliveryDate) && (
                          <span className="text-[8px] text-muted font-semibold mt-0.5">
                            Delivered: {new Date(order.deliveredAt || order.deliveryDate).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-heading">
                      ₹{((order.totalPaise || 0) / 100).toLocaleString()}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                    </td>
                  </tr>
                );
              });

              const allRows = [...rows.filter(Boolean), ...directRows.filter(Boolean)];
              
              if (allRows.length === 0) {
                return (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted/60 text-sm">No archive records found.</td>
                  </tr>
                );
              }
              return allRows;
            })()}
          </tbody>
        </table>
        
        {/* Infinite Scroll Trigger */}
        {orderPage < orderTotalPages && (
          <div ref={loadMoreRef} className="py-8 flex justify-center items-center w-full bg-surface/30 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted font-bold text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              Loading more orders...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
