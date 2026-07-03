"use client";
import React from "react";

export function InquiriesTab({
  inquiries,
  setSelectedInquiryMessage,
}: {
  inquiries: any[];
  setSelectedInquiryMessage: (msg: string | null) => void;
}) {
  return (
              <div className="bg-surface-card border border-border rounded-2xl overflow-x-auto shadow-sm">
                 <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-surface text-muted">
                           <th className="p-4 font-bold uppercase">Date &amp; Time</th>
                           <th className="p-4 font-bold uppercase">Name</th>
                           <th className="p-4 font-bold uppercase">Phone</th>
                           <th className="p-4 font-bold uppercase">Email</th>
                           <th className="p-4 font-bold uppercase">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {inquiries.map(i => (
                           <tr key={i.id} className="hover:bg-surface-hover">
                              <td className="p-4 text-muted whitespace-nowrap">{new Date(i.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                              <td className="p-4 font-bold text-heading whitespace-nowrap">{i.name}</td>
                              <td className="p-4 whitespace-nowrap font-mono">{i.phone || "N/A"}</td>
                              <td className="p-4">{i.email}</td>
                              <td 
                                className="p-4 max-w-md truncate cursor-pointer text-blue-500 hover:text-blue-600 hover:underline" 
                                onClick={() => setSelectedInquiryMessage(i.message)}
                                title="Click to read full message"
                              >
                                {i.message}
                              </td>
                           </tr>
                        ))}
                    </tbody>
                 </table>
              </div>
  );
}
