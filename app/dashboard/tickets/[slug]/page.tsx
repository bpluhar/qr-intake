// app/dashboard/tickets/[slug]/page.tsx
// Ticket detail page — mirrors the customer detail layout
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../helpers/Breadcrumbs";
import { TicketRow, ticketRows } from "../../tickets";
import { PriorityBadge, SeverityBadge, StatusBadge, NuetralBadge } from "../../badges";


/* -------------------------------------------------------------------- */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = Number(slug);

  // ticketRows should be defined/imported in the same module scope
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const ticket: TicketRow | undefined = ticketRows.find((t) => t.id === id);

  if (!ticket) notFound();

  const kpis = [
    { label: "Status", value: ticket.status },
    { label: "Severity", value: ticket.severity },
    { label: "Priority", value: ticket.priority },
    { label: "Created", value: ticket.created },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <Breadcrumbs />
        <Link
          href="#"
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
        >
          Reply
        </Link>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{k.value}</p>
              </div>
              <span className="mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-700/30 text-slate-300 ring-1 ring-slate-600/40">
                —
              </span>
            </div>
          </Card>
        ))}
      </section>

      {/* Main & sidebar */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Ticket Activity / Details (left 2/3) --- */}
        <section className="lg:col-span-2">
          <Card>
            <h2 className="text-sm font-medium text-slate-300 mb-4">Activity</h2>
            <p className="text-sm text-slate-400">
              This area can display the ticket conversation or event timeline.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-xs text-slate-500">• Ticket opened on {ticket.created}</li>
              <li className="text-xs text-slate-500">• Assigned to {ticket.assignees.join(", ") || "—"}</li>
            </ul>
          </Card>
        </section>

        {/* --- Sidebar (right 1/3) --- */}
        <aside className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-sm font-medium text-slate-300 mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <button className="rounded-md bg-slate-800/60 px-3 py-2 text-xs font-medium ring-1 ring-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600">
                Change Status
              </button>
              <button className="rounded-md bg-slate-800/60 px-3 py-2 text-xs font-medium ring-1 ring-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600">
                Assign
              </button>
              <button className="rounded-md bg-slate-800/60 px-3 py-2 text-xs font-medium ring-1 ring-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600">
                Add Note
              </button>
            </div>
          </Card>

          {/* Ticket Information */}
          <Card>
            <h2 className="text-sm font-medium text-slate-300 mb-3">Ticket Information</h2>
            <form className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Title</label>
                <input
                  type="text"
                  defaultValue={ticket.title}
                  className="w-full rounded-md bg-slate-800/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Status</label>
                <div className="flex gap-2">
                  {(["Open", "Pending", "Resolved"] as const).map((s) => (
                    <button key={s} type="button" className="focus:outline-none">
                      {s === ticket.status ? (
                        <StatusBadge status={s} />
                      ) : (
                        <NuetralBadge text={s} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Priority</label>
                <div className="flex gap-2">
                  {(["P1", "P2", "P3", "P4"] as const).map((p) => (
                    <button key={p} type="button" className="focus:outline-none">
                      {p === ticket.priority ? (
                        <PriorityBadge priority={p} />
                      ) : (
                        <NuetralBadge text={p} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Severity</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High", "Critical"] as const).map((sev) => (
                    <button key={sev} type="button" className="focus:outline-none">
                      {sev === ticket.severity ? (
                        <SeverityBadge severity={sev} />
                      ) : (
                        <NuetralBadge text={sev} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md border border-transparent bg-[#249F73] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                Save Changes
              </button>
            </form>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Reusable UI bits                                                    */
/* -------------------------------------------------------------------- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
      {children}
    </div>
  );
}