import Link from "next/link";

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-transparent border-transparent">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/70 ring-1 ring-slate-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 3l7 5-7 5-7-5 7-5Zm0 8v10"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Link href="/">
            <span className="font-semibold tracking-tight">Triager</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-slate-300 hover:text-slate-100"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm text-slate-300 hover:text-slate-100"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate-300 hover:text-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white
                         bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
          >
            Start now
          </Link>
        </nav>
      </div>
    </header>
  );
}
