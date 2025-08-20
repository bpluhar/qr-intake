// app/about/page.tsx
// Public About page – follows the same dark theme & components conventions

import Link from "next/link";
import Navbar from "../Navbar";
import { Card } from "@/app/components/Card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b1217] text-slate-200">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-500 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              We’re building the fastest way to triage support
            </h1>
            <p className="mt-4 text-slate-400">
              Triage helps teams respond to customers, keep SLAs green, and stay
              focused. Opinionated defaults, clean workflows, and just enough
              automation.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                Start now — it’s free
              </Link>
              <Link
                href="#values"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: "2.4k", label: "Active users" },
            { k: "99.95%", label: "Uptime" },
            { k: "< 200ms", label: "Avg API latency" },
            { k: "7d", label: "Time to value" },
          ].map((s) => (
            <Card key={s.label}>
              <p className="text-2xl font-semibold text-slate-100">{s.k}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        id="values"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold">Our values</h2>
          <p className="mt-2 text-sm text-slate-400">
            A product philosophy that keeps teams shipping.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Fast by default"
            desc="Snappy UI, instant search, and predictable controls so you can move."
          />
          <Feature
            title="Privacy first"
            desc="Customer data stays yours. We minimize collection and maximize control."
          />
          <Feature
            title="Pragmatic automation"
            desc="Automate the work you repeat, surface the work that needs judgment."
          />
          <Feature
            title="Built for teams"
            desc="Roles, permissions, and collaboration that get out of your way."
          />
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-medium text-slate-300">
                Why we built Triage
              </h3>
              <p className="mt-3 text-slate-300">
                Modern support tools are either heavyweight and slow or too
                bare-bones. Triage is a focused middle ground—clean, fast, and
                built around queues, SLAs and quick actions. We obsess over the
                80% of work you do every day and make it frictionless.
              </p>
            </div>
            <div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  In a hurry?
                </p>
                <p className="mt-2 text-sm">
                  Jump right in and explore the dashboard.
                  <br />
                  <Link
                    href="/dashboard"
                    className="underline decoration-emerald-500/60 underline-offset-4 hover:text-slate-100"
                  >
                    Go to dashboard →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold">Team</h2>
          <p className="mt-2 text-sm text-slate-400">
            A small, senior crew building the tool we wanted for our own
            customers.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <Card key={m.email}>
              <div className="flex items-center gap-3">
                <Avatar name={m.name} />
                <div>
                  <p className="font-medium text-slate-100">{m.name}</p>
                  <p className="text-sm text-slate-400">{m.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">Ready to triage faster?</h3>
              <p className="mt-1 text-sm text-slate-400">
                Start now—no credit card required.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                Start now
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ UI Helpers ------------------------------ */

// Removed local Card in favor of shared component

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-400">
          ★
        </span>
        <div>
          <p className="font-medium text-slate-100">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{desc}</p>
        </div>
      </div>
    </Card>
  );
}

function Avatar({ name }: { name: string }) {
  const i = initials(name);
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-sm font-medium">
      {i}
    </div>
  );
}

const team = [
  {
    name: "Brian Pluhar",
    role: "Founder & Engineer",
    email: "brian@example.com",
  },
  { name: "Jane Smith", role: "Design", email: "jane@example.com" },
  { name: "Alex Lee", role: "Frontend", email: "alex@example.com" },
  { name: "Priya Patel", role: "Backend", email: "priya@example.com" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}
