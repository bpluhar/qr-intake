import Link from "next/link";
import Navbar from "./Navbar";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b1217] text-slate-200">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className="relative">
        {/* subtle background tint */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(62,207,142,0.08),transparent)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:pt-16 lg:pb-0 flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <p className="text-sm text-slate-400">
              Smart support, faster teams
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
              Triage, track, and resolve&nbsp;
              <span className="relative inline-block">
                <span className="absolute inset-0 -z-10 opacity-30 blur-lg bg-[#3ECF8E]" />
                issues
              </span>{" "}
              without the busywork.
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-base text-slate-400">
              Triager is a developer-first dashboard for tickets, customers, and
              reports—built with Next.js 15, Tailwind, and a clean dark theme.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-white
                           bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2
                           focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                Start now
                <svg
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium
                           text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700
                           focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                Watch demo
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              No credit card required • Free to start
            </p>
          </div>

          {/* Right-side illustration / preview moved below CTAs */}
          <div className="mt-2">
            <Image
              src="/Preview.png"
              alt="Product Preview"
              width={4336}
              height={2562}
              className="max-w-[100%] mx-auto h-auto"
            />
            {
              /* <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-xl backdrop-blur mx-auto">
              <div className="h-72 sm:h-96 rounded-xl border border-dashed border-slate-700/70 bg-slate-900/30 grid place-content-center">

              </div>
            </div> */
            }
          </div>
        </div>
      </section>

      {/* Mini features */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Tickets in one place"
            body="Prioritize, assign, and clear SLAs with ease."
          />
          <Feature
            title="Customer context"
            body="Know who you're helping with fast lookups."
          />
          <Feature
            title="Reports that matter"
            body="Track response times and team workload."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Triager</span>
          <Link href="/dashboard" className="hover:text-slate-300">
            Get started
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* --- Small helpers matching your card & radius styles --- */

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
      <h3 className="text-sm font-medium text-slate-300">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </div>
  );
}
