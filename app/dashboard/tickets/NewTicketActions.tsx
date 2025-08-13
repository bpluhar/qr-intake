"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { refreshTickets } from "./actions";



export function NewTicketActions() {
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [severity, setSeverity] = useState("Medium");
    const [status, setStatus] = useState("Open");

    const createTicket = useMutation(api.functions.tickets.createTicket);
    async function handleSaveTicket() {
        await createTicket({
        title,
        priority: priority || undefined,
        severity: severity || undefined,
        status: status || undefined,
        });
        setShowNewTicketModal(false);
        setTitle("");
        setPriority("");
        setSeverity("");
        setStatus("");
        await refreshTickets(); // server action call

    }

    return (
        <div className="flex items-center gap-2">
            <button
            onClick={() => setShowNewTicketModal(true)}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
            New
            </button>
            <button
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
            >
            Export
            </button>
            {showNewTicketModal && <TicketModal 
                title={title} 
                setTitle={setTitle} 
                severity={severity} 
                setSeverity={setSeverity} 
                priority={priority} 
                setPriority={setPriority} 
                status={status} 
                setStatus={setStatus} 
                onClose={() => setShowNewTicketModal(false)} 
                handleSaveTicket={handleSaveTicket} 
            />}
        </div>
    );
}

export function TicketModal({
  title,
  setTitle,
  severity,
  setSeverity,
  priority,
  setPriority,
  status,
  setStatus,
  onClose,
  handleSaveTicket
}: {
  title: string;
  setTitle: (val: string) => void;
  severity: string;
  setSeverity: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  onClose: () => void;
  handleSaveTicket: () => Promise<void>;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">New Ticket</h2>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSaveTicket();
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Ticket Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
              placeholder="Enter ticket title"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Severity
            </label>
            <input
              type="text"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Priority
            </label>
            <input
              type="text"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Status
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
            />
          </div>
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}