export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      {/* <SkeletonSidebar initialEmail={initialEmail ?? null} /> */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Title */}
          <div className="mb-6">
            <SkeletonLine className="h-6 w-40" />
            <SkeletonLine className="mt-2 h-4 w-72" />
          </div>

          {/* KPI cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SkeletonLine className="h-3 w-24" />
                    <SkeletonLine className="mt-3 h-7 w-20" />
                  </div>
                  <SkeletonLine className="h-5 w-14 rounded-md" />
                </div>
              </Card>
            ))}
          </section>

          {/* Main grid */}
          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center justify-between">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="h-7 w-16 rounded-md" />
                </div>

                <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/60 text-slate-400">
                      <tr>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <th key={i} className="px-3 py-2 text-left">
                            <SkeletonLine className="h-3 w-16" />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {Array.from({ length: 5 }).map((_, r) => (
                        <tr key={r} className="hover:bg-slate-900/30">
                          {Array.from({ length: 4 }).map((_, c) => (
                            <td key={c} className="px-3 py-2">
                              <SkeletonLine className="h-4 w-24" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <SkeletonLine className="h-4 w-56" />
                  <SkeletonLine className="h-7 w-20 rounded-md" />
                </div>
                <div className="mt-4 h-56 rounded-md border border-dashed border-slate-700/70 bg-slate-900/30 grid place-content-center">
                  <SkeletonLine className="h-6 w-64" />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <SkeletonLine className="h-4 w-32" />
                <div className="mt-4 grid gap-3">
                  <SkeletonLine className="h-9 w-full rounded-md" />
                  <SkeletonLine className="h-9 w-full rounded-md" />
                  <SkeletonLine className="h-9 w-full rounded-md" />
                </div>
              </Card>

              <Card>
                <SkeletonLine className="h-4 w-32" />
                <ul className="mt-4 space-y-3 text-sm">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <SkeletonLine className="h-4 w-24" />
                      <div className="inline-flex items-center gap-2">
                        <SkeletonCircle className="h-2 w-2" />
                        <SkeletonLine className="h-4 w-24" />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------ Helpers ------------------------------ */

import { Card } from "@/app/components/Card";


function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-700/50 ${className}`} />;
}
function SkeletonCircle({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-700/50 ${className}`} />;
}