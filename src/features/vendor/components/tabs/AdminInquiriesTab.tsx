"use client";

import React from "react";

interface AdminInquiriesTabProps {
  generalInquiries: any[];
  setModalMessage: (msg: any) => void;
}

export default function AdminInquiriesTab({
  generalInquiries,
  setModalMessage,
}: AdminInquiriesTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-xs">
      <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-sm text-heading uppercase tracking-wider">Global B2B & Contact Inquiries</h3>
        <p className="text-[10px] text-muted mt-0.5">Master view of all general quotes and client message submissions.</p>
      </div>
      
      <div className="space-y-6">
        {generalInquiries.length === 0 ? (
          <div className="text-center py-12 bg-surface-card border border-border rounded-2xl">
            <p className="text-sm text-muted">No general inquiries or contact requests received yet.</p>
          </div>
        ) : (
          generalInquiries.map((inq) => {
            let itemsList: any[] = [];
            try {
              itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
            } catch (e) {
              itemsList = (inq.items as any[]) || [];
            }
            return (
              <div key={inq.id} className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                {/* Inquiry Header */}
                <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-base text-heading font-display">{inq.name}</h3>
                    <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                      📍 {inq.country || "Domestic Sales"} {inq.companyName ? `(${inq.companyName})` : ""}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-muted bg-surface border border-border px-3 py-1 rounded-full">
                    Received: {new Date(inq.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Inquiry Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-body">
                      ✉️ <span className="font-bold text-heading">Email:</span> {inq.email}
                    </p>
                    <p className="flex items-center gap-2 text-body">
                      📞 <span className="font-bold text-heading">Phone:</span> {inq.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-heading mb-1">Message / Requirements:</h4>
                    <div className="bg-surface p-3 rounded-lg border border-border italic text-muted text-xs">
                      {inq.message && inq.message.length > 180 ? (
                        <div className="space-y-1.5">
                          <p>"{inq.message.slice(0, 180)}..."</p>
                          <button
                            type="button"
                            onClick={() => setModalMessage(inq)}
                            className="text-[10px] text-orange-500 hover:text-orange-600 font-bold transition-colors underline cursor-pointer"
                          >
                            Read Full Message
                          </button>
                        </div>
                      ) : (
                        <p>"{inq.message}"</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cart Items if present */}
                {itemsList.length > 0 && (
                  <div className="bg-surface border border-border rounded-2xl p-4">
                    <h4 className="font-bold text-xs text-heading mb-2">Requested Items:</h4>
                    <div className="space-y-2">
                      {itemsList.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-body font-semibold">
                            {item.name} <span className="text-[10px] text-muted">({item.orderType || "Bulk Order"})</span>
                          </span>
                          <span className="font-bold text-heading">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
