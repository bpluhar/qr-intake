export default function DashboardClient() {

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      {/* <Sidebar pathname={pathname} initialEmail={initialEmail} /> */}
      <main className="flex-1">
        {/* Page content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb / Page title */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Quick glance at your product health and recent activity.</p>
          </div>

          {/* KPI cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Open tickets" value="128" delta="+6.7%" />
            <StatCard label="Avg response" value="72h 48m" delta="+512%" positive={false} />
            <StatCard label="SLA breaches" value="3" delta="-25%" positive={true} />
            <StatCard label="Active users" value="2,413" delta="+3.1%" />
          </section>

          {/* Main grid */}
          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Activity / left column */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-slate-300">Recent Activity</h2>
                  <button className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                    View all
                  </button>
                </div>

                <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/60 text-slate-400">
                      <tr>
                        <Th>Ticket</Th>
                        <Th>Customer</Th>
                        <Th>Status</Th>
                        <Th>Updated</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { id: '#4832', cust: 'Acme Inc.', status: 'Open', time: '3m ago' },
                        { id: '#4831', cust: 'Globex', status: 'Pending', time: '15m ago' },
                        { id: '#4829', cust: 'Soylent', status: 'Resolved', time: '1h ago' },
                        { id: '#4828', cust: 'Initech', status: 'Open', time: '2h ago' },
                      ].map((r) => (
                        <tr key={r.id} className="hover:bg-slate-900/30">
                          <Td className="font-medium text-slate-200">{r.id}</Td>
                          <Td>{r.cust}</Td>
                          <Td>
                            <StatusBadge status={r.status} />
                          </Td>
                          <Td className="text-slate-400">{r.time}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-slate-300">Workload (placeholder)</h2>
                  <button className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                    Configure
                  </button>
                </div>
                <div className="mt-4 h-56 rounded-md border border-dashed border-slate-700/70 bg-slate-900/30 grid place-content-center text-slate-500 text-sm">
                  Add a chart here (e.g., area chart of tickets over time)
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-sm font-medium text-slate-300">Quick actions</h2>
                <div className="mt-4 grid gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white
                               bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2
                               focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
                  >
                    New Ticket
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700">
                    Invite teammate
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700">
                    Export report
                  </button>
                </div>
              </Card>

              <Card>
                <h2 className="text-sm font-medium text-slate-300">System status</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">API</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Operational
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">Database</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Operational
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">Auth</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      Degraded
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- Small UI helpers (match sign-in rounded + palette) ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
        </div>
        <span
          className={`mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs ${
            positive
              ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
              : 'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30'
          }`}
        >
          {delta}
        </span>
      </div>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">{children}</th>
  );
}
function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2 text-sm ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: 'Open' | 'Pending' | 'Resolved' | string }) {
  const map: Record<string, string> = {
    Open: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30',
    Pending: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30',
    Resolved: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[status] ?? 'bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40'}`}>
      {status}
    </span>
  );
}