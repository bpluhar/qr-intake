// app/dashboard/customers/page.tsx
// Server Component – matches the dark, Supabase-like theme used across /dashboard

import Link from "next/link";

export default function CustomersPage() {
  const kpis = [
    { label: "New signups (7d)", value: "34" },
    { label: "Active customers", value: "1,284" },
    { label: "Churn rate (7d)", value: "1.2%" },
    { label: "Avg MRR / customer", value: "$72" },
  ];

  const rows: CustomerRow[] = [
    { name: "Acme Admin", email: "admin@acme.io", company: "Acme Inc.", plan: "Business", mrr: 899, status: "Active", created: "Aug 01, 2025", lastSeen: "Today 09:18" },
    { name: "Jane Smith", email: "jane@globex.com", company: "Globex", plan: "Pro", mrr: 149, status: "Active", created: "Aug 01, 2025", lastSeen: "Today 08:41" },
    { name: "Alex Lee", email: "alex@initech.co", company: "Initech", plan: "Pro", mrr: 149, status: "Trial", created: "Jul 31, 2025", lastSeen: "Today 07:03" },
    { name: "Priya Patel", email: "priya@umbrella.com", company: "Umbrella", plan: "Business", mrr: 699, status: "Churn risk", created: "Jul 31, 2025", lastSeen: "Yesterday 18:27" },
    { name: "Diego Ramos", email: "diego@soylent.org", company: "Soylent", plan: "Free", mrr: 0, status: "Invited", created: "Jul 30, 2025", lastSeen: "—" },
    { name: "Bruce Wayne", email: "bruce@wayneenterprises.com", company: "Wayne Enterprises", plan: "Business", mrr: 1299, status: "Active", created: "Jul 29, 2025", lastSeen: "Yesterday 11:10" },
    { name: "Tony Stark", email: "tony@starkindustries.com", company: "Stark Industries", plan: "Business", mrr: 1599, status: "Active", created: "Jul 28, 2025", lastSeen: "Sun 16:02" },
    { name: "Peter Parker", email: "peter@oscorp.com", company: "Oscorp", plan: "Pro", mrr: 149, status: "Trial", created: "Jul 27, 2025", lastSeen: "Sun 13:44" },
    { name: "Ellen Ripley", email: "ellen@weyland.com", company: "Weyland-Yutani", plan: "Pro", mrr: 149, status: "Churn risk", created: "Jul 26, 2025", lastSeen: "Sat 21:08" },
    { name: "Michael Scott", email: "michael@dundermifflin.com", company: "Dunder Mifflin", plan: "Free", mrr: 0, status: "Active", created: "Jul 25, 2025", lastSeen: "Sat 09:55" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Customers</h1>
          {/* <p className="mt-1 text-sm text-slate-400">Manage accounts, monitor activity and track revenue.</p> */}
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
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Customers table */}
      <section className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">All customers</h2>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Filters
              </Link>
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Columns
              </Link>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400">
                <tr>
                  <Th>Customer</Th>
                  <Th className="hidden md:table-cell">Email</Th>
                  <Th className="hidden md:table-cell">Company</Th>
                  <Th>Plan</Th>
                  <Th>MRR</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Last seen</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.map((r) => (
                  <tr key={r.email} className="hover:bg-slate-900/30">
                    <Td className="font-medium text-slate-200">
                      <div className="flex items-start gap-2 md:items-center md:gap-3">
                        <Avatar name={r.name} />
                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                          <span className="text-slate-300 text-sm leading-tight md:hidden">{r.company}</span>
                          <span className="text-slate-100 font-medium leading-tight md:hidden">{r.name}</span>
                          <span className="text-slate-400 text-sm leading-tight md:hidden">{r.email}</span>
                          <span className="hidden md:inline">{r.name}</span>
                        </div>
                      </div>
                    </Td>
                    <Td className="truncate max-w-[16rem] hidden md:table-cell">{r.email}</Td>
                    <Td className="hidden md:table-cell">{r.company}</Td>
                    <Td><PlanBadge plan={r.plan} /></Td>
                    <Td className="whitespace-nowrap">{formatUsd(r.mrr)}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td className="text-slate-400 whitespace-nowrap">{r.created}</Td>
                    <Td className="text-slate-400 whitespace-nowrap">{r.lastSeen}</Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">View</Link>
                        <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">Message</Link>
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

type CustomerRow = {
  name: string;
  email: string;
  company: string;
  plan: "Free" | "Pro" | "Business";
  mrr: number; // monthly recurring revenue in USD
  status: "Active" | "Trial" | "Churn risk" | "Invited";
  created: string; // formatted date string
  lastSeen: string; // formatted date string or '—'
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
  return (
    <td className={`px-3 py-3 md:py-2 align-top md:align-middle text-sm ${className}`}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: CustomerRow["status"] }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    Trial: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    "Churn risk": "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
    Invited: "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[status]}`}>{status}</span>
  );
}

function PlanBadge({ plan }: { plan: CustomerRow["plan"] }) {
  const map: Record<string, string> = {
    Free: "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40",
    Pro: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    Business: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[plan]}`}>{plan}</span>
  );
}

function Avatar({ name }: { name: string }) {
  const i = initials(name);
  return (
    <div className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-[10px] font-medium">
      {i}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

function formatUsd(n: number) {
  return n === 0 ? "$0" : `$${n.toLocaleString()}`;
}