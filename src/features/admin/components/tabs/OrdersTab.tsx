"use client";
import React from "react";
import { DollarSign, Award, Package, FileText, Globe, Loader2 } from "lucide-react";

export function OrdersTab({
  orders,
  orderStats,
  orderPage,
  orderTotalPages,
  exchangeRates,
  loadMoreRef,
}: {
  orders: any[];
  orderStats: any[];
  orderPage: number;
  orderTotalPages: number;
  exchangeRates: Record<string, number> | null;
  loadMoreRef: (node: HTMLDivElement | null) => void;
}) {
  let totalSalesINR = 0;
  let totalSalesUSD = 0;
  let totalCommissionINR = 0;
  let totalCommissionUSD = 0;
  let nonCancelledCountINR = 0;
  let nonCancelledCountUSD = 0;
  let globalConvertedRevenueINR = 0;
  const statusCounts: Record<string, number> = {};
  const paymentCounts: Record<string, number> = {};

  const statsSource = orderStats && orderStats.length > 0 ? orderStats : orders;
  statsSource.forEach(o => {
     const status = (o.status || "").toUpperCase();
     statusCounts[status] = (statusCounts[status] || 0) + 1;

     const method = (o.paymentMethod || "").toLowerCase();
     paymentCounts[method] = (paymentCounts[method] || 0) + 1;

     const excludedStatuses = ["CANCELLED", "RETURN_APPROVED", "RETURN_PICKED", "RETURN_RECEIVED", "RETURNED", "REFUNDED", "FAILED"];
     if (!excludedStatuses.includes(status)) {
        const currency = o.currency || "INR";
        const rawPaise = o.totalPaise || 0;
        
        if (currency === "USD") {
           totalSalesUSD += rawPaise;
           totalCommissionUSD += o.commissionPaise || 0;
           nonCancelledCountUSD += 1;
        } else {
           totalSalesINR += rawPaise;
           totalCommissionINR += o.commissionPaise || 0;
           nonCancelledCountINR += 1;
        }

        if (currency === "INR") {
           globalConvertedRevenueINR += rawPaise;
        } else {
           if (exchangeRates && exchangeRates[currency]) {
              globalConvertedRevenueINR += rawPaise / exchangeRates[currency];
           } else {
              globalConvertedRevenueINR += rawPaise / (currency === "USD" ? 0.012 : 1);
           }
        }
     }
  });

  const aovINR = nonCancelledCountINR > 0 ? totalSalesINR / nonCancelledCountINR : 0;
  const aovUSD = nonCancelledCountUSD > 0 ? totalSalesUSD / nonCancelledCountUSD : 0;
  const totalOrders = orderStats && orderStats.length > 0 ? orderStats.length : orders.length;

  return (
                 <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 shadow-xl text-white flex justify-between items-center border border-blue-400/30">
                       <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-50 mb-1 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                             Estimated Global Revenue (Auto-Converted to INR)
                          </h3>
                          <div className="text-4xl font-black tracking-tight drop-shadow-sm mt-2">
                             ₹{(globalConvertedRevenueINR / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                          <p className="text-[10px] text-blue-100 mt-2 opacity-80">Live exchange rates used to auto-convert all international sales.</p>
                       </div>
                       <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                          <Globe size={32} className="text-white" />
                       </div>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-gray-700 transition-all flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-4">
                             <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Gross Sales</p>
                             <span className="p-2 bg-gray-800 text-orange-400 rounded-lg">
                                <DollarSign size={16} />
                             </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white flex items-baseline gap-1.5">
                              ₹{(totalSalesINR / 100).toLocaleString()} <span className="text-xs font-semibold text-gray-500">INR</span>
                            </h3>
                            {(totalSalesUSD > 0 || nonCancelledCountUSD > 0) && (
                              <h3 className="text-lg font-bold text-gray-400 flex items-baseline gap-1.5">
                                ${(totalSalesUSD / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] font-semibold text-gray-500">USD</span>
                              </h3>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-4 leading-relaxed font-medium">Total revenue generated from all valid purchases (excludes cancelled orders &amp; refunds).</p>
                       </div>

                       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-gray-700 transition-all flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-4">
                             <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Platform Earnings</p>
                             <span className="p-2 bg-gray-800 text-emerald-400 rounded-lg">
                                <Award size={16} />
                             </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white flex items-baseline gap-1.5">
                              ₹{(totalCommissionINR / 100).toLocaleString()} <span className="text-xs font-semibold text-gray-500">INR</span>
                            </h3>
                            {(totalCommissionUSD > 0 || nonCancelledCountUSD > 0) && (
                              <h3 className="text-lg font-bold text-gray-400 flex items-baseline gap-1.5">
                                ${(totalCommissionUSD / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] font-semibold text-gray-500">USD</span>
                              </h3>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-4 leading-relaxed font-medium">Total commission earned by StopShop from successful vendor sales.</p>
                       </div>

                       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-gray-700 transition-all flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-4">
                             <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Total Orders</p>
                             <span className="p-2 bg-gray-800 text-blue-400 rounded-lg">
                                <Package size={16} />
                             </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white">{totalOrders}</h3>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-4 leading-relaxed font-medium">Total count of all orders placed by users across all vendors.</p>
                       </div>

                       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-gray-700 transition-all flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-4">
                             <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Avg Order Value</p>
                             <span className="p-2 bg-gray-800 text-purple-400 rounded-lg">
                                <FileText size={16} />
                             </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white flex items-baseline gap-1.5">
                              ₹{(aovINR / 100).toLocaleString()} <span className="text-xs font-semibold text-gray-500">INR</span>
                            </h3>
                            {(aovUSD > 0 || nonCancelledCountUSD > 0) && (
                              <h3 className="text-lg font-bold text-gray-400 flex items-baseline gap-1.5">
                                ${(aovUSD / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] font-semibold text-gray-500">USD</span>
                              </h3>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-4 leading-relaxed font-medium">Average amount spent per valid order on the platform, providing insight into customer purchasing power.</p>
                       </div>
                    </div>

                    {/* Visual Charts Section */}
                    {totalOrders > 0 && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order Lifecycle Statuses */}
                          <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                             <h4 className="font-bold text-xs uppercase tracking-wider text-heading flex items-center gap-1.5">
                                <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span> Order Lifecycle Status
                             </h4>
                             <div className="space-y-3">
                                {[
                                   { label: "Delivered", count: statusCounts["DELIVERED"] || 0, color: "bg-emerald-500" },
                                   { label: "Pending & Confirmed", count: (statusCounts["PENDING"] || 0) + (statusCounts["CONFIRMED"] || 0) + (statusCounts["PACKED"] || 0), color: "bg-amber-500" },
                                   { label: "In Transit / Dispatched", count: statusCounts["DISPATCHED"] || 0, color: "bg-blue-500" },
                                   { label: "Cancelled", count: statusCounts["CANCELLED"] || 0, color: "bg-red-500" },
                                ].map((st, i) => {
                                   const pct = totalOrders > 0 ? Math.round((st.count / totalOrders) * 100) : 0;
                                   return (
                                      <div key={i} className="space-y-1">
                                         <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-muted">{st.label} ({st.count})</span>
                                            <span className="text-heading">{pct}%</span>
                                         </div>
                                         <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                                            <div className={`h-full ${st.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                                         </div>
                                      </div>
                                   );
                                })}
                             </div>
                          </div>

                          {/* Payment Method Split */}
                          <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                             <h4 className="font-bold text-xs uppercase tracking-wider text-heading flex items-center gap-1.5">
                                <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> Payment Methods Split
                             </h4>
                             <div className="space-y-3">
                                {[
                                   { label: "Razorpay (Online Payment)", count: paymentCounts["razorpay"] || 0, color: "bg-indigo-500" },
                                   { label: "PayU (Online Payment)", count: paymentCounts["payu"] || 0, color: "bg-violet-500" },
                                   { label: "Cash on Delivery (COD)", count: paymentCounts["cod"] || 0, color: "bg-orange-500" },
                                ].map((pm, i) => {
                                   const pct = totalOrders > 0 ? Math.round((pm.count / totalOrders) * 100) : 0;
                                   return (
                                      <div key={i} className="space-y-1">
                                         <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-muted">{pm.label} ({pm.count})</span>
                                            <span className="text-heading">{pct}%</span>
                                         </div>
                                         <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                                            <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                                         </div>
                                      </div>
                                   );
                                })}
                             </div>
                          </div>
                       </div>
                    )}

                    {/* Existing Orders Table */}
                    <div className="bg-surface-card border border-border rounded-3xl overflow-hidden shadow-sm">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-surface text-muted">
                             <tr>
                                <th className="p-4 font-bold uppercase tracking-wider">Order ID</th>
                                <th className="p-4 font-bold uppercase tracking-wider">Date</th>
                                <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                                <th className="p-4 font-bold uppercase tracking-wider">Payment</th>
                                <th className="p-4 font-bold uppercase tracking-wider">Total</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                             {orders.map(o => (
                                <tr key={o.id} className="hover:bg-surface-hover">
                                   <td className="p-4 font-bold text-heading">{o.orderNumber}</td>
                                   <td className="p-4">{new Date(o.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</td>
                                   <td className="p-4">
                                      <span className="px-2 py-1 rounded bg-surface border border-border text-[9px] font-bold uppercase">
                                         {o.status.replace(/_/g, ' ')}
                                      </span>
                                   </td>
                                   <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${o.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                         {o.paymentMethod}
                                      </span>
                                   </td>
                                   <td className="p-4 font-bold text-xs">
                                      {o.currency === "USD" ? "$" : "₹"}{(o.totalPaise/100).toLocaleString(undefined, o.currency === "USD" ? {minimumFractionDigits: 2, maximumFractionDigits: 2} : {})}
                                   </td>
                                </tr>
                             ))}
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
