export function TicketsPageSkeleton() {
  return (
    <>
      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="animate-pulse flex items-start justify-between">
              <div className="w-full">
                <div className="h-3 w-24 rounded bg-slate-700/40" />
                <div className="mt-3 h-6 w-20 rounded bg-slate-700/40" />
              </div>
              <span className="mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-700/30 text-slate-300 ring-1 ring-slate-600/40">—</span>
            </div>
          </Card>
        ))}
      </section>

      {/* Tickets table */}
      <section className="mt-6">
        <Card>
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-slate-700/40" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 rounded-md bg-slate-800/60 ring-1 ring-slate-700" />
              <div className="h-6 w-16 rounded-md bg-slate-800/60 ring-1 ring-slate-700" />
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
                {Array.from({ length: 10 }).map((_, i) => (
                  <RowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-2 overflow-hidden">
        <div className="h-4 w-12 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 overflow-hidden">
        <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
        <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
        <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
        <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
        <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 overflow-hidden">
        <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 overflow-hidden">
        <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
      </td>
      <td className="px-3 py-2 overflow-hidden text-right">
        <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
      </td>
    </tr>
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

export default function TicketsTableSkeleton() {
  return (
    <>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-4 w-full max-w-[14rem] md:max-w-[28rem] rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-28 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-5 w-full max-w-20 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-7 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 hidden md:table-cell overflow-hidden">
          <div className="h-4 w-full max-w-24 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden">
          <div className="h-5 w-full max-w-12 rounded bg-slate-700/40" />
        </td>
        <td className="px-3 py-2 overflow-hidden text-right">
          <div className="ml-auto h-6 w-full max-w-16 rounded bg-slate-700/40" />
        </td>
      </tr>
    </>
  );
}