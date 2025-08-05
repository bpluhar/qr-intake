"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthActions } from '@convex-dev/auth/react';
import SignIn from '@/app/signin/page';
import DashboardSkeleton from '@/app/dashboard/DashboardSkeleton';

export default function DashboardClient({ initialEmail }: { initialEmail: string | null }) {
  const pathname = usePathname();
  const signedIn = useQuery(api.users.isSignedIn);
  const currentUser = useQuery(api.users.getCurrent);

  // Optional: persist for skeleton / other pages
  useEffect(() => {
    if (signedIn && currentUser) {
      try {
        const email = (currentUser as any)?.email ?? '';
        setCookie('triage_user', JSON.stringify(currentUser), 7);
        setCookie('triage_email', String(initialEmail), 7);
      } catch {}
    }
  }, [signedIn, currentUser]);

  if (signedIn === undefined) {
    return <DashboardSkeleton />;
  }
  if (!signedIn) {
    return <SignIn />;
  }
  if (!currentUser) {
    throw new Error('User not found. Please sign in again.');
  }

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      <Sidebar pathname={pathname} initialEmail={initialEmail} />
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

/* ------------------------- Sidebar + helpers -------------------------- */

function Sidebar({ pathname, initialEmail }: { pathname: string; initialEmail: string | null }) {
  const nav = [
    { href: '/dashboard', label: 'Overview', icon: IconHome },
    { href: '/dashboard/tickets', label: 'Tickets', icon: IconTicket },
    { href: '/dashboard/customers', label: 'Customers', icon: IconUsers },
    { href: '/dashboard/reports', label: 'Reports', icon: IconChart },
    { href: '/dashboard/settings', label: 'Settings', icon: IconSettings },
    { href: '/dashboard/testing', label: 'Testing', icon: IconTesting },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-900/60 backdrop-blur">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/70 ring-1 ring-slate-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M12 3l7 5-7 5-7-5 7-5Zm0 8v10" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight">Triage</span>
        </div>

        <nav className="mt-4 space-y-1">
          {nav.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href} />
          ))}
        </nav>
      </div>

      <UserPanel initialEmail={initialEmail} />
    </aside>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm border border-transparent hover:bg-slate-800/70 ${
        active ? 'bg-slate-800/70 border-slate-700 text-white' : 'text-slate-300'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-300" />
      <span>{label}</span>
    </Link>
  );
}

function UserPanel({ initialEmail }: { initialEmail: string | null }) {
  const me = useQuery(api.users.getCurrent);
//   const email = me?.email ?? initialEmail ?? 'user@example.com';

  return (
    <div className="p-4 border-t border-slate-800/80">
      <div className="flex items-center gap-3">
        <Avatar email={initialEmail ?? ""} />
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-200">{initialEmail}</p>
          <div className="mt-2">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ email }: { email: string }) {
  const letter = (email?.[0] ?? 'U').toUpperCase();
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60">
      <span className="text-sm font-medium">{letter}</span>
    </div>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  const [pending, setPending] = useState(false);
  return (
    <button
      onClick={async () => {
        setPending(true);
        try {
          await signOut();
          deleteCookie('triage_user');
          deleteCookie('triage_email');
        } finally {
          setPending(false);
        }
      }}
      className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}

/* ------------------------------ Cookie helpers ------------------------------ */
function setCookie(name: string, value: string, days: number) {
  try {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}
function deleteCookie(name: string) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  } catch {}
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

function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function IconTicket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
  </svg>
  );
}

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function IconChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function IconSettings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293 .241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function IconTesting(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}