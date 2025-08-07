import { TicketRow } from "./tickets";

export function NuetralBadge({ text }: { text: string }) {
  return (
    <span  className={`inline-flex cursor-pointer items-center rounded-md px-2 py-0.5 text-xs bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40 focus:outline-none focus:ring-2 focus:ring-current`}>
      {text}
    </span>
  );
}

export function StatusBadge({ status }: { status: TicketRow["status"] }) {
  const map: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
    Pending: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Resolved: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  };
  return (
    <span  className={`inline-flex cursor-pointer items-center rounded-md px-2 py-0.5 text-xs ${map[status] ?? "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40"} focus:outline-none focus:ring-2 focus:ring-current`}>
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: TicketRow["severity"] }) {
  const map: Record<string, string> = {
    Low: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    Medium: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    High: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Critical: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
  };
  return (
    <span  className={`inline-flex cursor-pointer items-center rounded-md px-2 py-0.5 text-xs ${map[severity]} focus:outline-none focus:ring-2 focus:ring-current`}>{severity}</span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketRow["priority"] }) {
  const map: Record<string, string> = {
    P1: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
    P2: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    P3: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    P4: "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40",
  };
  return (
    <span  className={`inline-flex cursor-pointer items-center rounded-md px-2 py-0.5 text-xs ${map[priority]} focus:outline-none focus:ring-2 focus:ring-current`}>{priority}</span>
  );
}