'use client';

import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { usePathname } from 'next/navigation';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      <SkeletonSidebar />
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
      {children}
    </div>
  );
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const pair = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  return pair ? decodeURIComponent(pair.split('=')[1]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-700/50 ${className}`} />;
}
function SkeletonCircle({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-700/50 ${className}`} />;
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
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

function SkeletonSidebar() {
  const { signOut } = useAuthActions();
  const [pending, setPending] = useState(false);
  const pathname = usePathname();
  const [email, setEmail] = useState<string>('');

  // Read cookie on client after hydration to avoid SSR/CSR mismatch
  useEffect(() => {
    setEmail(getCookie('triage_email') ?? '');
  }, []);

  const initial = (email.trim()[0] ?? 'U').toUpperCase();

  const nav: { href: string; label: string; icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element }[] = [
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
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm border border-transparent hover:bg-slate-800/70 ${
                  active ? 'bg-slate-800/70 border-slate-700 text-white' : 'text-slate-300'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className={`h-4 w-4 ${active ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60">
            <span className="text-sm font-medium">{initial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-slate-200">{email}</p>
            <div className="mt-2">
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
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}