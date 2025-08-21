"use client";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TicketRow } from "../tickets";

export function NewTicketActions() {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("P4");
  const [severity, setSeverity] = useState("Low");
  const [status, setStatus] = useState("Open");
  const [isRunning, setIsRunning] = useState(false);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [bulkIndex, setBulkIndex] = useState(0);

  const createTicket = useMutation(api.functions.tickets.createTicket);
  const bulkCreateTickets = useMutation(api.functions.tickets.bulkCreateTickets);
  // Options used for randomization in bulk creation
  const severityOptionsAll = ["Low", "Medium", "High", "Critical"] as const;
  const priorityOptionsAll = ["P4", "P3", "P2", "P1"] as const;


  // Open this modal in response to a global event so other components can trigger it
  useEffect(() => {
    const handler = () => setShowNewTicketModal(true);
    window.addEventListener("triage:open-new-ticket", handler as EventListener);
    return () => {
      window.removeEventListener("triage:open-new-ticket", handler as EventListener);
    };
  }, []);

  async function handleSaveTicket() {
    await createTicket({
      title,
      description,
      priority: priority || "P1",
      severity: severity || "Low",
      status: status || "Open",
    });
    setShowNewTicketModal(false);
    setTitle("");
    setDescription("");
    setPriority("P4");
    setSeverity("Low");
    setStatus("Open");
  }

  async function handleSaveTicketBulk(count: number) {
    setIsRunning(true);
    setBulkTotal(count);
    setBulkIndex(0);
    try {
      const tickets: { title: string; description?: string; priority: string; severity: string; status: string }[] = [];
      for (let i = 0; i < count; i++) {
        const randomPriority = priorityOptionsAll[Math.floor(Math.random() * priorityOptionsAll.length)];
        const randomSeverity = severityOptionsAll[Math.floor(Math.random() * severityOptionsAll.length)];
        tickets.push({
          title: `${title} ${i + 1}`,
          description,
          priority: randomPriority as string,
          severity: randomSeverity as string,
          status: status || "Open",
        });
        setBulkIndex(i + 1);
      }
      await bulkCreateTickets({ tickets });
      setShowNewTicketModal(false);
      setTitle("");
      setDescription("");
      setPriority("P4");
      setSeverity("Low");
      setStatus("Open");
    } finally {
      setIsRunning(false);
      setBulkIndex(0);
      setBulkTotal(0);
    }
  }

  const handleSaveTicket10 = () => handleSaveTicketBulk(10);
  const handleSaveTicket25 = () => handleSaveTicketBulk(25);
  const handleSaveTicket100 = () => handleSaveTicketBulk(100);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowNewTicketModal(true)}
        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
      >
        New
      </button>
      <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">
        Export
      </button>
      {showNewTicketModal && (
        <TicketModal
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          severity={severity}
          setSeverity={setSeverity}
          priority={priority}
          setPriority={setPriority}
          status={status}
          setStatus={setStatus}
          onClose={() => setShowNewTicketModal(false)}
          handleSaveTicket={handleSaveTicket}
          handleSaveTicket10={handleSaveTicket10}
          handleSaveTicket25={handleSaveTicket25}
          handleSaveTicket100={handleSaveTicket100}
          isRunning={isRunning}
          bulkIndex={bulkIndex}
          bulkTotal={bulkTotal}
        />
      )}
    </div>
  );
}

export function TicketModal({
  title,
  setTitle,
  description,
  setDescription,
  severity,
  setSeverity,
  priority,
  setPriority,
  onClose,
  handleSaveTicket,
  handleSaveTicket10,
  handleSaveTicket25,
  handleSaveTicket100,
  isRunning,
  bulkIndex,
  bulkTotal,
}: {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  severity: string;
  setSeverity: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  onClose: () => void;
  handleSaveTicket: () => Promise<void>;
  handleSaveTicket10: () => Promise<void>;
  handleSaveTicket25: () => Promise<void>;
  handleSaveTicket100: () => Promise<void>;
  isRunning: boolean;
  bulkIndex: number;
  bulkTotal: number;
}) {
  const severityOptions = ["Low", "Medium", "High", "Critical"];
  const priorityOptions = ["P4", "P3", "P2", "P1"];

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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217] resize-y"
              placeholder="Enter ticket description"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Severity
            </label>
            <div className="flex gap-2">
              {severityOptions.map((option) => {
                const isSelected = severity === option;
                const baseClasses =
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs cursor-pointer select-none";
                const map: Record<string, string> = {
                  Low:
                    "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
                  Medium: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
                  High:
                    "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
                  Critical: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
                };
                const grayStyle =
                  "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSeverity(option)}
                    className={`${baseClasses} ${
                      isSelected ? map[option] : grayStyle
                    }`}
                    aria-pressed={isSelected}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Priority
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => {
                const isSelected = priority === option;
                const baseClasses =
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs cursor-pointer select-none";
                const map: Record<string, string> = {
                  P1: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
                  P2:
                    "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
                  P3: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
                  P4:
                    "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
                };
                const grayStyle =
                  "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPriority(option)}
                    className={`${baseClasses} ${
                      isSelected ? map[option] : grayStyle
                    }`}
                    aria-pressed={isSelected}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Status
            </label>
            <div>
              <StatusBadge status="Open" />
            </div>
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
              type="button"
              onClick={async () => {
                await handleSaveTicket10();
                onClose();
              }}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              disabled={isRunning}
            >
              {isRunning ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>{bulkIndex}/{bulkTotal}</span>
                </span>
              ) : (
                "Save 10"
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                await handleSaveTicket25();
                onClose();
              }}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              disabled={isRunning}
            >
              {isRunning ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>{bulkIndex}/{bulkTotal}</span>
                </span>
              ) : (
                "Save 25"
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                await handleSaveTicket100();
                onClose();
              }}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              disabled={isRunning}
            >
              {isRunning ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>{bulkIndex}/{bulkTotal}</span>
                </span>
              ) : (
                "Save 100"
              )}
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

function StatusBadge({ status }: { status: TicketRow["status"] }) {
  const map: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
    Pending: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Resolved: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${
        map[status] ?? "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40"
      }`}
    >
      {status}
    </span>
  );
}
