"use client";

import React, { useState, useEffect } from "react";
import { LifeBuoy, Search, Mail, Phone, Clock, CheckCircle2, AlertCircle, MessageSquare, Loader2 } from "lucide-react";

interface Ticket {
  id: number;
  name: string;
  email: string;
  mobile: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  adminNotes?: string;
  createdAt: string;
}

export const HelpSupportTab = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: number) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNotes: notesInput })
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, adminNotes: notesInput } : t));
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.id.toString() === q ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.mobile.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2 font-display">
            <LifeBuoy className="text-orange-500" size={22} />
            Help & Support Tickets
          </h2>
          <p className="text-xs text-muted mt-0.5">Manage customer and vendor support inquiries in real-time.</p>
        </div>
        <button
          onClick={fetchTickets}
          className="px-4 py-2 bg-surface-card border border-border/80 hover:bg-surface-hover rounded-xl text-xs font-bold text-heading transition-all shadow-sm cursor-pointer"
        >
          Refresh Tickets
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email, mobile, or message..."
            className="w-full bg-surface-card border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs text-heading focus:outline-none focus:border-orange-500 transition-all placeholder:text-muted/50"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map((st) => {
            const count = st === "ALL" ? tickets.length : tickets.filter(t => t.status === st).length;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-heading text-surface shadow-sm"
                    : "bg-surface-card hover:bg-surface-hover text-muted hover:text-heading border border-border/80"
                }`}
              >
                {st === "ALL" ? "All Tickets" : st.replace(/_/g, " ")} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border/60 text-muted font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">ID & Date</th>
              <th className="p-4 min-w-[180px]">Contact Info</th>
              <th className="p-4 min-w-[220px]">Description / Query</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 min-w-[180px]">Admin Notes</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center">
                  <Loader2 className="animate-spin text-orange-500 mx-auto" size={24} />
                  <span className="text-xs text-muted font-bold block mt-2">Loading Support Tickets...</span>
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted font-semibold">
                  No support tickets found.
                </td>
              </tr>
            ) : (
              paginatedTickets.map((t) => (
                <tr key={t.id} className="hover:bg-surface/50 transition-colors">
                  {/* ID & Date */}
                  <td className="p-4 align-top">
                    <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                      #{t.id}
                    </span>
                    <span className="block text-[10px] text-muted mt-1 font-medium">
                      {new Date(t.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>

                  {/* Contact Info */}
                  <td className="p-4 align-top space-y-1">
                    <p className="font-bold text-heading">{t.name}</p>
                    <a href={`mailto:${t.email}`} className="text-[11px] text-orange-500 hover:underline flex items-center gap-1">
                      <Mail size={11} /> {t.email}
                    </a>
                    <a href={`tel:${t.mobile}`} className="text-[11px] text-muted hover:text-heading flex items-center gap-1 font-mono">
                      <Phone size={11} className="text-orange-500" /> {t.mobile}
                    </a>
                  </td>

                  {/* Description */}
                  <td className="p-4 align-top">
                    <p className="text-xs text-body leading-relaxed max-w-sm whitespace-pre-wrap">
                      {t.description}
                    </p>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 align-top text-center">
                    <select
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase border focus:outline-none cursor-pointer ${
                        t.status === "OPEN"
                          ? "bg-red-500/10 text-red-500 border-red-500/30"
                          : t.status === "IN_PROGRESS"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          : t.status === "RESOLVED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : "bg-surface text-muted border-border"
                      }`}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>

                  {/* Admin Notes */}
                  <td className="p-4 align-top">
                    {editingNotesId === t.id ? (
                      <div className="space-y-1.5">
                        <textarea
                          rows={2}
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="Add internal resolution note..."
                          className="w-full bg-surface border border-border rounded-lg p-2 text-xs focus:outline-none focus:border-orange-500 resize-none"
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleSaveNotes(t.id)}
                            className="px-2 py-0.5 bg-orange-500 text-white rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-0.5 bg-surface border border-border text-muted rounded text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingNotesId(t.id);
                          setNotesInput(t.adminNotes || "");
                        }}
                        className="p-2 rounded-xl bg-surface border border-border/60 text-[11px] text-muted hover:border-orange-500/50 cursor-pointer min-h-[36px]"
                      >
                        {t.adminNotes || <span className="italic text-muted/60">+ Add note</span>}
                      </div>
                    )}
                  </td>

                  {/* Quick Action Buttons */}
                  <td className="p-4 align-top text-right whitespace-nowrap space-x-1.5">
                    {t.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleUpdateStatus(t.id, "RESOLVED")}
                        className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    <a
                      href={`mailto:${t.email}?subject=StopShop Support Ticket %23${t.id}&body=Hi ${t.name},%0D%0A%0D%0ARegarding your ticket %23${t.id}: "${t.description.slice(0, 50)}..."`}
                      className="px-2.5 py-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors inline-block"
                    >
                      Reply Email
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {filteredTickets.length > itemsPerPage && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50">
            <span className="text-xs text-muted font-medium">
              Showing <span className="font-bold text-heading">{Math.min(filteredTickets.length, (currentPage - 1) * itemsPerPage + 1)}</span> - <span className="font-bold text-heading">{Math.min(filteredTickets.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-heading">{filteredTickets.length}</span> tickets
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
};
