// app/dashboard/reports/page.tsx
// Server Component – uses the same dark theme tokens you’ve been using in /dashboard

import Link from "next/link";

export default function ReportsPage() {
  const kpis = [
    { label: "Reports available", value: "8", variant: "neutral" as const },
    { label: "Scheduled reports", value: "3", variant: "neutral" as const },
    { label: "Last generated", value: "2h ago", variant: "neutral" as const },
    { label: "Exports this month", value: "27", variant: "positive" as const },
  ];

  const rows: ReportRow[] = [
    {
      name: "Total Time on Each Ticket",
      desc: "Sum of agent + waiting time per ticket with percentile breakdowns.",
      status: "Ready",
      lastRun: "Today, 09:12",
    },
    {
      name: "Average Response Time",
      desc: "Mean & P95 of first/next-response times by queue.",
      status: "Scheduled",
      lastRun: "Today, 07:00",
    },
    {
      name: "Tickets by Status",
      desc: "Open, Pending, Resolved counts grouped by day and team.",
      status: "Ready",
      lastRun: "Yesterday, 17:35",
    },
    {
      name: "Tickets by Assignee",
      desc: "Volume, median resolution time per agent.",
      status: "Ready",
      lastRun: "Yesterday, 12:20",
    },
    {
      name: "SLA Breaches Over Time",
      desc: "Breaches by policy with trend line and week-over-week deltas.",
      status: "Ready",
      lastRun: "Mon, 10:02",
    },
    {
      name: "Customer Satisfaction (CSAT)",
      desc: "Positive/neutral/negative ratings with comments sample.",
      status: "Needs setup",
      lastRun: "—",
    },
    {
      name: "Backlog Aging",
      desc: "Tickets older than 3/7/14/30 days by priority.",
      status: "Ready",
      lastRun: "Sun, 15:48",
    },
    {
      name: "Resolution Time Distribution",
      desc: "Histogram + P50/P90 by category.",
      status: "Ready",
      lastRun: "Sun, 11:06",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Reports</h1>
          {/* <p className="mt-1 text-sm text-slate-400">Analyze performance with prebuilt and custom reports.</p> */}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
          >
            New
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Export
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{k.value}</p>
              </div>
              <span
                className={
                  k.variant === "positive"
                    ? "mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                    : "mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-700/30 text-slate-300 ring-1 ring-slate-600/40"
                }
              >
                {k.variant === "positive" ? "Up" : "—"}
              </span>
            </div>
          </Card>
        ))}
      </section>

      {/* Reports table */}
      <section className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">Available reports</h2>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Manage schedules
              </Link>
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Create custom
              </Link>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400">
                <tr>
                  <Th>Report</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th>Last run</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.map((r) => (
                  <tr key={r.name} className="hover:bg-slate-900/30">
                    <Td className="font-medium text-slate-200">{r.name}</Td>
                    <Td className="text-slate-400">{r.desc}</Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td className="text-slate-400">{r.lastRun}</Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">
                          View
                        </Link>
                        <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">
                          Export
                        </Link>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

/* --------------------------------- Types -------------------------------- */

type ReportRow = {
  name: string;
  desc: string;
  status: "Ready" | "Scheduled" | "Needs setup" | string;
  lastRun: string;
};

/* ------------------------------ UI Helpers ------------------------------ */

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

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-sm ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: ReportRow["status"] }) {
  const map: Record<string, string> = {
    Ready: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    Scheduled: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    "Needs setup": "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
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