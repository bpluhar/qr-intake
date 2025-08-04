'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthActions } from '@convex-dev/auth/react';
import SignIn from '@/app/SignIn';

export default function DashboardPage() {
  // Sidebar can be made collapsible later if you want; keeping it fixed per request.
  const pathname = usePathname();
  const signedIn = useQuery(api.users.isSignedIn);

  // Avoid jarring shift: show a themed splash while auth state is loading
  if (signedIn === undefined) {
    return (
      <div className="min-h-screen bg-[#0b1217] text-slate-200 flex items-center justify-center p-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur inline-flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" aria-hidden="true" />
          <span className="text-sm text-slate-400">Loading your session…</span>
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      <Sidebar pathname={pathname} />
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
            <StatCard label="Avg response" value="1h 12m" delta="-12%" positive={true} />
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

function Sidebar({ pathname }: { pathname: string }) {
  const nav = [
    { href: '/dashboard', label: 'Overview', icon: IconHome },
    { href: '/dashboard/tickets', label: 'Tickets', icon: IconTicket },
    { href: '/dashboard/customers', label: 'Customers', icon: IconUsers },
    { href: '/dashboard/reports', label: 'Reports', icon: IconChart },
    { href: '/dashboard/settings', label: 'Settings', icon: IconSettings },
    { href: '/dashboard/testing', label: 'Testing', icon: IconSettings }, // Placeholder for testing
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
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href} />)
          )}
        </nav>
      </div>

      <UserPanel />
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

function UserPanel() {
  const me = useQuery(api.users.getCurrent);
  

  return (
    <div className="p-4 border-t border-slate-800/80">
      <div className="flex items-center gap-3">
        <Avatar email={me?.email ?? undefined} />
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-200">{me?.email ?? 'user@example.com'}</p>
          <div className="mt-2">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ email }: { email?: string }) {
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M3 10.5L12 3l9 7.5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9.5A1.5 1.5 0 006.5 21h11A1.5 1.5 0 0019 19.5V10" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTicket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4.5 7h15a2 2 0 012 2v1a2.5 2.5 0 110 5v1a2 2 0 01-2 2h-15a2 2 0 01-2-2v-1a2.5 2.5 0 110-5V9a2 2 0 012-2z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7v10" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" />
    </svg>
  );
}

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M16 11a4 4 0 10-8 0" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20a6 6 0 0118 0" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 9.5a3 3 0 110-6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 20a5 5 0 00-5-5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 20h16" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M7 20v-8" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 20v-12" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M17 20v-5" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function IconSettings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" strokeWidth={1.5} />
      <path d="M19.4 15a2 2 0 00.3-1l1.6-1a1 1 0 000-2l-1.6-1a2 2 0 00-.3-1l.3-1.8a1 1 0 00-1.2-1.2L16.7 5a2 2 0 00-1-.3l-1-1.6a1 1 0 00-2 0L11.6 4.7a2 2 0 00-1 .3L8.8 3.8a1 1 0 00-1.2 1.2L8 6.8a2 2 0 00-.3 1L6 8.8a1 1 0 000 2l1.6 1a2 2 0 00.3 1l-.3 1.8a1 1 0 001.2 1.2l1.8-.3a2 2 0 001 .3l1 1.6a1 1 0 002 0l1-1.6a2 2 0 001-.3l1.8.3a1 1 0 001.2-1.2L19.4 15z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}