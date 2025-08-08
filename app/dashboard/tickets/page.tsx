import Link from "next/link";
import Breadcrumbs from "@/app/dashboard/helpers/Breadcrumbs";
// import dynamic from "next/dynamic";
import { Suspense } from "react";

import { TicketsTableShell } from "./ticketsTableServer"; // Server Component
import { TicketsPageSkeleton } from "./ticketsTableSkeleton"; // Composite skeleton (KPIs + table chrome)

export default function TicketsPage() {

  const kpis = [
    { label: "Open tickets", value: "128" },
    { label: "New this week", value: "42" },
    { label: "Avg response", value: "2h 14m" },
    { label: "SLA breaches (7d)", value: "5" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <Breadcrumbs />
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
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Export
          </Link>
        </div>
      </div>

      <Suspense fallback={<TicketsPageSkeleton />}>
        <TicketsTableShell />
      </Suspense>
      
    </div>
  );
}

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