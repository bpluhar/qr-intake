// app/dashboard/tickets/page.tsx
import Breadcrumbs from "@/app/dashboard/helpers/Breadcrumbs";

import { NewTicketActions } from "./NewTicketActions";
import TicketsTableClient from "./ticketsTableClient";

export default function TicketsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Breadcrumbs />
        </div>
        <NewTicketActions />
      </div>
        <TicketsTableClient />
    </div>
  );
}
