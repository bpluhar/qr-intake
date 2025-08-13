// app/dashboard/tickets/page.tsx
import Breadcrumbs from "@/app/dashboard/helpers/Breadcrumbs";
// import dynamic from "next/dynamic";
import { Suspense } from "react";

import { TicketsTableShell } from "./ticketsTableServer"; // Server Component
import { TicketsPageSkeleton } from "./ticketsTableSkeleton"; // Composite skeleton (KPIs + table chrome)
import { NewTicketActions } from "./NewTicketActions";

export default function TicketsPage() {

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <Breadcrumbs />
        </div>
        <NewTicketActions />
      </div>

      <Suspense fallback={<TicketsPageSkeleton />}>
        <TicketsTableShell />
      </Suspense>
      
    </div>
  );
}