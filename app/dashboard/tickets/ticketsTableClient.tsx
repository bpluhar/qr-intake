"use client";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { TicketRow } from "../tickets";
import { useQuery } from "convex/react";

// type Props = { initialData: TicketRow[] };

export default function TicketsTableClient() {
  const docs = useQuery(api.functions.tickets.getByOrganizationId, {});
  const rows = (docs as TicketRow[] | undefined)?.map((d) => ({
        _id: d._id,
        _creationTime: d._creationTime,
        organizationId: d.organizationId,
        id: d.id,
        customer_id: d.customer_id,
        customer: d.customer,
        title: d.title,
        severity: d.severity as TicketRow["severity"],
        priority: d.priority as TicketRow["priority"],
        status: d.status as TicketRow["status"],
        created: d.created,
        assignees: d.assignees,
      })) ?? [];

  const openTicketsCount = rows.filter(r => r.status === "Open").length;

  const kpis = [
    { label: "Open tickets", value: openTicketsCount },
    { label: "New this week", value: "42" },
    { label: "Avg response", value: "2h 14m" },
    { label: "SLA breaches (7d)", value: "5" },
  ];

  return (
    <>
      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{k.value}</p>
              </div>
              <span className="mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-700/30 text-slate-300 ring-1 ring-slate-600/40">—</span>
            </div>
          </Card>
        ))}
      </section>

      {/* Tickets table */}
      <section className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">All tickets</h2>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Filters
              </Link>
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Columns
              </Link>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto md:overflow-visible rounded-md border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400">
                <tr>
                  <Th>ID</Th>
                  <Th>Title</Th>
                  <Th className="hidden md:table-cell">Customer</Th>
                  <Th className="hidden md:table-cell">Severity</Th>
                  <Th className="hidden md:table-cell">Assignees</Th>
                  <Th className="hidden md:table-cell">Created</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {rows?.map((r: TicketRow) => (
                  <tr key={r._id} className="hover:bg-slate-900/30">
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
                        <Link href={`/dashboard/tickets/${r._id}`} className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
      {children}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wide ${className}`}>{children}</th>
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