// app/teams/pages.tsx
// Server Component – matches the dark, Supabase‑like theme used across /dashboard

import Link from "next/link";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";
import { TableActions, TableTitle, Td, Th } from "@/app/components/Table";

/* --------------------------------- Data --------------------------------- */

type TeamRow = {
  name: string;
  members: number;
  created: string; // formatted date string
};

// In a real app, replace this with a database query / API call
async function getTeams(): Promise<TeamRow[]> {
  return [
    { name: "Engineering", members: 12, created: "Jan 12, 2025" },
    { name: "Design", members: 7, created: "Feb 03, 2025" },
    { name: "Marketing", members: 5, created: "Mar 21, 2025" },
    { name: "Support", members: 9, created: "Apr 10, 2025" },
    { name: "QA", members: 6, created: "May 02, 2025" },
  ];
}

export const revalidate = 60; // ISR: update at most once per minute

export default async function CompaniesPage() {
  const rows = await getTeams();
  const teamCount = rows.length;
  const usersCount = rows.reduce((sum, t) => sum + t.members, 0);

  const kpis = [
    { label: "Teams", value: teamCount.toString() },
    { label: "Total members", value: usersCount.toString() },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Breadcrumbs />
        {/* <h1 className="text-xl font-semibold">Teams</h1> */}
        {/* <p className="mt-1 text-sm text-slate-400">Organize users into functional groups.</p> */}

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

      {/* KPI cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {k.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">
                  {k.value}
                </p>
              </div>
              <span className="mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-700/30 text-slate-300 ring-1 ring-slate-600/40">
                —
              </span>
            </div>
          </Card>
        ))}
      </section>

      {/* Teams table */}
      <section className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <TableTitle>All companies</TableTitle>
            <TableActions />
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400">
                <tr>
                  <Th>Team</Th>
                  <Th>Members</Th>
                  <Th>Created</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.map((t) => (
                  <tr key={t.name} className="hover:bg-slate-900/30">
                    <Td className="font-medium text-slate-200">
                      <div className="flex items-center gap-3">
                        <Avatar name={t.name} />
                        <span>{t.name}</span>
                      </div>
                    </Td>
                    <Td>{t.members}</Td>
                    <Td className="text-slate-400 whitespace-nowrap">
                      {t.created}
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href="#"
                          className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
                        >
                          View
                        </Link>
                        {/* <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">Message</Link> */}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

/* --------------------------------- UI ----------------------------------- */

// Removed local Card/Th/Td in favor of shared components

function Avatar({ name }: { name: string }) {
  const i = initials(name);
  return (
    <div className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-[10px] font-medium">
      {i}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}
