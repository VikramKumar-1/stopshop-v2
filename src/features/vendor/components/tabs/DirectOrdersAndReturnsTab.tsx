"use client";

import React from "react";
import { FileText, Loader2 } from "lucide-react";

interface DirectOrdersAndReturnsTabProps {
  activeTab: string;
  dashboardStats: any;
  directOrders: any[];
  vendor: any;
  products: any[];
  savingOrderId: any;
  editingDirectDelivery: any;
  setEditingDirectDelivery: any;
  handleUpdateDirectOrderStatus: any;
  formatDateTime: any;
  setModalShipping: (order: any) => void;
  setModalTransaction: (order: any) => void;
  openProductModal: (prod: any) => void;
  setShowPackingModal: (order: any) => void;
  simulateShiprocketWebhook: (awb: string, status: string) => void;
  setIsDisputing: (val: boolean) => void;
  setQcImages: (imgs: any[]) => void;
  setQcNotes: (notes: string) => void;
  setReviewReturnOrder: (order: any) => void;
  orderPage: number;
  orderTotalPages: number;
  loadMoreRef: any;
  currentTime?: Date;
  slaHours?: number;
}

export default function DirectOrdersAndReturnsTab({
  activeTab,
  dashboardStats,
  directOrders,
  vendor,
  products,
  savingOrderId,
  editingDirectDelivery,
  setEditingDirectDelivery,
  handleUpdateDirectOrderStatus,
  formatDateTime,
  setModalShipping,
  setModalTransaction,
  openProductModal,
  setShowPackingModal,
  simulateShiprocketWebhook,
  setIsDisputing,
  setQcImages,
  setQcNotes,
  setReviewReturnOrder,
  orderPage,
  orderTotalPages,
  loadMoreRef,
  currentTime,
  slaHours,
}: DirectOrdersAndReturnsTabProps) {
  return (
    <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300 relative">
      <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/70 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeTab === 'returns-action' ? 'bg-red-500' : 'bg-orange-500'} animate-ping`} />
            {activeTab === "direct-orders" ? "Direct Orders & Transactions" : 
             activeTab === "returns-pending" ? "Incoming Return Requests" : "Action Required: Delivered Returns"}
          </h3>
          <p className="text-[10px] text-muted mt-0.5">
            {activeTab === "direct-orders" ? "Manage automated checkout orders, payments, and dispatch dates" : 
             "Manage customer returns and disputes"}
          </p>
        </div>
      </div>

      {/* Stats Overview Grid (Only show for direct-orders) */}
      {activeTab === "direct-orders" && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-surface/50 border-b border-border/80 text-xs">
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">New Orders</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold font-display text-heading tracking-tight">
                {dashboardStats ? dashboardStats.pending : "..."}
              </span>
              <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 text-orange-500 rounded-md font-bold uppercase">Pending</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">To Be Dispatched</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold font-display text-heading tracking-tight">
                {dashboardStats ? dashboardStats.packed : "..."}
              </span>
              <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-500 rounded-md font-bold uppercase">Packed</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">In Transit</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold font-display text-heading tracking-tight">
                {dashboardStats ? dashboardStats.dispatched : "..."}
              </span>
              <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-600 rounded-md font-bold uppercase">Shipped</span>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
              <th className="px-5 py-4 font-bold">Order Date</th>
              <th className="px-5 py-4 font-bold min-w-[200px]">Buyer & Transaction</th>
              <th className="px-5 py-4 font-bold min-w-[220px]">Product details</th>
              <th className="px-5 py-4 font-bold text-center">Amount Paid</th>
              <th className="px-5 py-4 font-bold text-center min-w-[210px]">Shipping Stage</th>
              <th className="px-5 py-4 font-bold text-right min-w-[280px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {(() => {
              const activeDirects = directOrders.filter((o) => {
                if (activeTab === "returns-pending") {
                   return o.status === "RETURN_APPROVED" && !o.returnRequest?.vendorDeliveredAt;
                }
                if (activeTab === "returns-action") {
                   return o.status === "RETURN_RECEIVED" || (o.status === "RETURN_APPROVED" && o.returnRequest?.vendorDeliveredAt);
                }
                // Default "direct-orders" tab logic (hide returns and completed)
                return !["DELIVERED", "CANCELLED", "RETURNED", "RETURN_REJECTED", "RETURN_APPROVED", "RETURN_RECEIVED", "RETURN_REQUESTED"].includes(o.status || "PENDING");
              });

              if (activeDirects.length === 0) {
                return (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-muted text-sm">
                      No active "Buy Now" orders found.
                    </td>
                  </tr>
                );
              }

              return activeDirects.map((order) => {
                const currentStatus = order.status || "PENDING";
                return (
                  <tr key={order.id} className="hover:bg-orange-500/[0.03] transition-all duration-200 text-body align-middle group/row">
                    {/* Order Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-muted font-semibold text-[11px]">
                      {new Date(order.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>

                    {/* Buyer & Transaction */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 max-w-[200px] min-w-[150px]">
                        <div>
                          <span className="font-mono font-bold text-[11px] text-orange-500 block mb-0.5">{order.orderNumber || order.id}</span>
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

                    {/* Product Details */}
                    <td className="p-4">
                      <div className="flex flex-col gap-3">
                        {order.items && order.items.filter((item: any) => item.vendorId === vendor?.id).map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/60 bg-white flex-shrink-0 relative shadow-sm">
                              <img src={item.productImage || "/logo4.jpg"} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                              <span className="font-bold text-heading text-xs truncate" title={item.productName}>
                                {item.productName}
                              </span>
                              <div className="flex gap-1.5 items-center mt-0.5">
                                <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-[10px] text-muted font-medium">{item.productMaterial || "Bronze"}</span>
                              </div>
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

                    {/* Amount Paid */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-heading text-xs">₹{((order.totalPaise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <div className="flex gap-1 items-center mt-1 justify-center">
                          <span className={`border font-bold px-1.5 py-0.5 rounded text-[8px] uppercase ${order.paymentStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                            {order.paymentStatus || "PAID"}
                          </span>
                          {order.paymentMethod === 'cod' && (
                             <span className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase border">
                               COD
                             </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Shipping Stage */}
                    <td className="p-4 text-center min-w-[210px]">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          ["PENDING", "CONFIRMED"].includes(currentStatus) ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/25" :
                          currentStatus === "PACKED" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25" :
                          currentStatus.includes("RETURN") ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25" :
                          "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25"
                        }`}>
                          {currentStatus === "PENDING" ? "Ordered / Paid" : 
                           currentStatus === "RETURN_APPROVED" ? "Incoming Return" : 
                           currentStatus === "RETURN_RECEIVED" ? "QC Disputed" : currentStatus}
                        </span>

                        {/* SLA Countdown Timer Badge */}
                        {(currentStatus === "RETURN_RECEIVED" || (currentStatus === "RETURN_APPROVED" && order.returnRequest?.vendorDeliveredAt)) && (
                          (() => {
                            const deliveredTime = order.returnRequest?.vendorDeliveredAt 
                              ? new Date(order.returnRequest.vendorDeliveredAt).getTime() 
                              : new Date(order.updatedAt || order.createdAt).getTime();
                            const deadline = deliveredTime + 24 * 60 * 60 * 1000;
                            const diffMs = deadline - (currentTime ? currentTime.getTime() : Date.now());
                            if (diffMs <= 0) {
                              return (
                                <span className="text-[9px] bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/30 animate-pulse mt-0.5">
                                  ⏰ SLA Expired (Auto-Refund)
                                </span>
                              );
                            }
                            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
                            const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            return (
                              <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/30 mt-0.5">
                                ⏳ SLA: <strong className="text-red-500 font-black">{hoursLeft}h {minutesLeft}m left</strong>
                              </span>
                            );
                          })()
                        )}

                        {/* Progress Stepper for Vendor */}
                        {!currentStatus.includes("RETURN") && currentStatus !== "CANCELLED" && (
                          <div className="flex items-center gap-1 my-1 justify-center">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
                              ["PENDING", "CONFIRMED", "PACKED", "DISPATCHED", "DELIVERED"].includes(currentStatus) ? "bg-orange-500 text-white" : "bg-border text-muted"
                            }`} title="Ordered">O</div>
                            <div className={`w-3 h-[2px] ${["PACKED", "DISPATCHED", "DELIVERED"].includes(currentStatus) ? "bg-orange-500" : "bg-border"}`} />
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
                              ["PACKED", "DISPATCHED", "DELIVERED"].includes(currentStatus) ? "bg-orange-500 text-white" : "bg-border text-muted"
                            }`} title="Packed">P</div>
                            <div className={`w-3 h-[2px] ${["DISPATCHED", "DELIVERED"].includes(currentStatus) ? "bg-orange-500" : "bg-border"}`} />
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
                              ["DISPATCHED", "DELIVERED"].includes(currentStatus) ? "bg-orange-500 text-white" : "bg-border text-muted"
                            }`} title="Dispatched">S</div>
                            <div className={`w-3 h-[2px] ${["DELIVERED"].includes(currentStatus) ? "bg-orange-500" : "bg-border"}`} />
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
                              currentStatus === "DELIVERED" ? "bg-orange-500 text-white" : "bg-border text-muted"
                            }`} title="Delivered">D</div>
                          </div>
                        )}

                        {["PENDING", "CONFIRMED", "PACKED", "DISPATCHED"].includes(currentStatus) && (
                          <div className="w-full max-w-[190px] flex flex-col items-center gap-1.5">
                            {editingDirectDelivery && editingDirectDelivery.orderId === order.id ? (
                              <div className="flex flex-col gap-1.5 w-full bg-surface-card border border-border p-2.5 rounded-2xl shadow-xl z-15 relative">
                                <span className="text-[8px] text-muted font-bold uppercase tracking-wider block text-left">Set Est. Delivery:</span>
                                <input
                                  type="datetime-local"
                                  min={(() => {
                                    const now = new Date();
                                    const tzOffset = now.getTimezoneOffset() * 60000;
                                    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
                                  })()}
                                  value={editingDirectDelivery.value}
                                  onChange={(e) => setEditingDirectDelivery(editingDirectDelivery ? { ...editingDirectDelivery, value: e.target.value } : null)}
                                  className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-[10px] text-heading font-medium outline-none focus:border-orange-500 transition-colors"
                                />
                                <div className="flex gap-1.5 justify-end mt-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingDirectDelivery(null)}
                                    className="px-2 py-1 text-[9px] text-muted hover:text-heading bg-surface hover:bg-surface-hover border border-border rounded-lg font-semibold transition-all"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (editingDirectDelivery) {
                                        handleUpdateDirectOrderStatus(order.id, currentStatus, editingDirectDelivery.value);
                                        setEditingDirectDelivery(null);
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
                                {order.deliveryDate ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-[8px] text-muted font-bold uppercase tracking-wider">Est. Delivery:</span>
                                    <span className="text-[10px] text-heading font-semibold bg-surface border border-border px-2 py-0.5 rounded-lg whitespace-nowrap">
                                      {formatDateTime(order.deliveryDate)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setEditingDirectDelivery({ 
                                        orderId: order.id, 
                                        value: order.deliveryDate ? new Date(order.deliveryDate).toISOString().slice(0, 16) : "" 
                                      })}
                                      className="mt-1 text-[9px] text-orange-500 hover:text-orange-600 font-bold transition-colors underline"
                                    >
                                      Change Date
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setEditingDirectDelivery({ orderId: order.id, value: "" })}
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

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap space-x-2">
                      {["PENDING", "CONFIRMED"].includes(currentStatus) && (
                        <button
                          type="button"
                          disabled={savingOrderId === order.id}
                          onClick={() => setShowPackingModal(order)}
                          className={`px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold shadow-sm shadow-blue-500/10 transition-all duration-200 ${savingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Start Packing (Upload Photos)
                        </button>
                      )}
                      {currentStatus === "PACKED" && (
                        <div className="flex items-center gap-2 justify-end">
                          {order.shippingLabelUrl && (
                            <a
                              href={order.shippingLabelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 text-[9px] text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl font-bold transition-colors border border-emerald-500/20 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FileText size={10} /> Print Label
                            </a>
                          )}
                          {order.awbCode && (
                            <button
                              type="button"
                              disabled={!!savingOrderId}
                              onClick={() => simulateShiprocketWebhook(order.awbCode, "PICKED UP")}
                              className={`px-2 py-1.5 text-[9px] text-purple-600 bg-purple-500/10 hover:bg-purple-500 hover:text-white rounded-xl font-bold transition-colors border border-purple-500/20 ${savingOrderId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Simulate Pickup (Test Webhook)
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={savingOrderId === order.id}
                            onClick={() => handleUpdateDirectOrderStatus(order.id, "DISPATCHED")}
                            className={`px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl font-bold shadow-sm shadow-orange-500/10 transition-all duration-200 inline-flex items-center gap-1.5 ${savingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {savingOrderId === order.id && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {savingOrderId === order.id ? 'Dispatching...' : 'Dispatch Order (Manual)'}
                          </button>
                        </div>
                      )}
                      {currentStatus === "RETURN_APPROVED" && !order.returnRequest?.vendorDeliveredAt && (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-[10px] text-muted font-medium italic">Awaiting Return Delivery...</span>
                          {order.returnAwbCode && (
                            <button
                              type="button"
                              disabled={!!savingOrderId}
                              onClick={() => simulateShiprocketWebhook(order.returnAwbCode, "DELIVERED")}
                              className={`px-2 py-1 text-[9px] text-purple-600 bg-purple-500/10 hover:bg-purple-500 hover:text-white rounded-md font-bold transition-colors border border-purple-500/20 ${savingOrderId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Test Webhook
                            </button>
                          )}
                        </div>
                      )}

                      {currentStatus === "DISPATCHED" && (
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            disabled={savingOrderId === order.id}
                            onClick={() => handleUpdateDirectOrderStatus(order.id, "DELIVERED")}
                            className={`px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl font-bold shadow-sm shadow-emerald-500/10 transition-all duration-200 inline-flex items-center gap-1.5 ${savingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {savingOrderId === order.id && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {savingOrderId === order.id ? 'Delivering...' : 'Mark Delivered (Manual)'}
                          </button>
                          {order.awbCode && (
                            <button
                              type="button"
                              disabled={!!savingOrderId}
                              onClick={() => simulateShiprocketWebhook(order.awbCode, "DELIVERED")}
                              className={`px-2 py-1.5 text-[9px] text-purple-600 bg-purple-500/10 hover:bg-purple-500 hover:text-white rounded-xl font-bold transition-colors border border-purple-500/20 ${savingOrderId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Simulate Delivery (Test Webhook)
                            </button>
                          )}
                        </div>
                      )}
                      {(currentStatus === "RETURN_RECEIVED" || (currentStatus === "RETURN_APPROVED" && order.returnRequest?.vendorDeliveredAt)) && (
                        <div className="flex flex-col items-end gap-2">
                          {(() => {
                            const deliveredTime = order.returnRequest?.vendorDeliveredAt 
                              ? new Date(order.returnRequest.vendorDeliveredAt).getTime() 
                              : new Date(order.updatedAt || order.createdAt).getTime();
                            const deadline = deliveredTime + 24 * 60 * 60 * 1000;
                            const diffMs = deadline - (currentTime ? currentTime.getTime() : Date.now());
                            if (diffMs <= 0) {
                              return (
                                <span className="text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-2.5 py-1 rounded-lg border border-red-500/30 animate-pulse flex items-center gap-1 shadow-sm">
                                  ⏰ SLA Expired (Auto-Refund Soon)
                                </span>
                              );
                            }
                            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
                            const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            return (
                              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 shadow-sm">
                                ⏳ SLA Time Left: <strong className="text-red-500 font-black">{hoursLeft}h {minutesLeft}m</strong>
                              </span>
                            );
                          })()}
                          {order.returnRequest?.status === "RECEIVED_AT_WAREHOUSE" ? (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1.5 text-[10px] text-muted bg-border rounded-xl font-bold cursor-not-allowed"
                            >
                              Dispute Under Admin Review
                            </button>
                          ) : (() => {
                            const deliveredTime = order.returnRequest?.vendorDeliveredAt 
                              ? new Date(order.returnRequest.vendorDeliveredAt).getTime() 
                              : new Date(order.updatedAt || order.createdAt).getTime();
                            const deadline = deliveredTime + (slaHours || 24) * 60 * 60 * 1000;
                            const isExpired = deadline - (currentTime ? currentTime.getTime() : Date.now()) <= 0;
                            if (isExpired) {
                              return (
                                <button
                                  type="button"
                                  disabled
                                  className="px-3 py-1.5 text-[10px] text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-bold cursor-not-allowed"
                                >
                                  ⏰ SLA Expired (Dispute Closed)
                                </button>
                              );
                            }
                            return (
                              <button
                                type="button"
                                disabled={savingOrderId === order.id}
                                onClick={() => {
                                  setIsDisputing(false);
                                  setQcImages([]);
                                  setQcNotes("");
                                  setReviewReturnOrder(order);
                                }}
                                className={`px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold shadow-sm shadow-red-500/10 transition-all duration-200 ${savingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Review Delivered Return (QC)
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              });
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
