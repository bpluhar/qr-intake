"use client";
import Link from "next/link";
// import { useEffect } from "react";
import { TicketRow } from "../tickets";


type Props = { initialData: TicketRow[] };

export default function TicketsTableClient({ initialData }: Props) {
  const rows = initialData ?? [];

  return (
    <>
      {rows.map((r: TicketRow) => (
        <tr key={r.id} className="hover:bg-slate-900/30">
          <td className="px-3 py-2 text-sm font-medium text-slate-200 whitespace-nowrap">#{r.id}</td>
          <td className="px-3 py-2 text-sm max-w-[14rem] md:max-w-[28rem] truncate text-slate-200">{r.title}</td>
          <td className="px-3 py-2 text-sm hidden md:table-cell">{r.customer}</td>
          <td className="px-3 py-2 text-sm hidden md:table-cell"><SeverityBadge severity={r.severity} /></td>
          <td className="px-3 py-2 text-sm hidden md:table-cell"><Assignees names={r.assignees} /></td>
          <td className="px-3 py-2 text-sm hidden md:table-cell text-slate-400 whitespace-nowrap">{r.created}</td>
          <td className="px-3 py-2 text-sm"><StatusBadge status={r.status} /></td>
          <td className="px-3 py-2 text-sm"><PriorityBadge priority={r.priority} /></td>
          <td className="px-3 py-2 text-sm text-right">
            <div className="inline-flex items-center gap-2">
              <Link href={`/dashboard/tickets/${r.id}`} className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">View</Link>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/* Lightweight copies for client side */
function StatusBadge({ status }: { status: TicketRow["status"] }) {
  const map: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
    Pending: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Resolved: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[status] ?? "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40"}`}>{status}</span>;
}

function SeverityBadge({ severity }: { severity: TicketRow["severity"] }) {
  const map: Record<string, string> = {
    Low: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    Medium: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    High: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Critical: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[severity]}`}>{severity}</span>;
}

function PriorityBadge({ priority }: { priority: TicketRow["priority"] }) {
  const map: Record<string, string> = {
    P1: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
    P2: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    P3: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    P4: "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40",
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[priority]}`}>{priority}</span>;
}

function Assignees({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.map((n) => (
        <div
          key={n}
          title={n}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-[10px] font-medium"
        >
          {initials(n)}
        </div>
      ))}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}