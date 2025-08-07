import Link from "next/link";

export default function TicketsPage() {
  const kpis = [
    { label: "Open tickets", value: "128" },
    { label: "New this week", value: "42" },
    { label: "Avg response", value: "2h 14m" },
    { label: "SLA breaches (7d)", value: "5" },
  ];

  const ticketRows: TicketRow[] = [
    { id: 5001, title: "Login fails with 500 on Safari", customer: "Acme Inc.", severity: "High", priority: "P1", status: "Open", created: "Aug 1, 2025", assignees: ["Brian Pluhar", "Jane Smith"] },
    { id: 5002, title: "Slow dashboard load > 8s", customer: "Globex", severity: "Medium", priority: "P2", status: "Pending", created: "Aug 1, 2025", assignees: ["Alex Lee"] },
    { id: 5003, title: "Webhook retries not firing", customer: "Initech", severity: "High", priority: "P1", status: "Open", created: "Jul 31, 2025", assignees: ["Priya Patel", "Alex Lee"] },
    { id: 5004, title: "2FA SMS not received (EU)", customer: "Umbrella", severity: "Critical", priority: "P1", status: "Open", created: "Jul 31, 2025", assignees: ["Brian Pluhar"] },
    { id: 5005, title: "CSV export drops last column", customer: "Soylent", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 30, 2025", assignees: ["Jane Smith"] },
    { id: 5006, title: "Billing page 400 on card update", customer: "Hooli", severity: "Medium", priority: "P2", status: "Open", created: "Jul 30, 2025", assignees: ["Diego Ramos"] },
    { id: 5007, title: "SAML SSO loops back to signin", customer: "Vehement", severity: "High", priority: "P1", status: "Pending", created: "Jul 29, 2025", assignees: ["Alex Lee", "Jane Smith"] },
    { id: 5008, title: "Email templates not saving vars", customer: "Stark Industries", severity: "Medium", priority: "P2", status: "Open", created: "Jul 29, 2025", assignees: ["Priya Patel"] },
    { id: 5009, title: "Search returns stale results", customer: "Wayne Enterprises", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 28, 2025", assignees: ["Brian Pluhar"] },
    { id: 5010, title: "OAuth redirect mismatch (Google)", customer: "Wonka", severity: "High", priority: "P1", status: "Open", created: "Jul 28, 2025", assignees: ["Jane Smith"] },
    { id: 5011, title: "Attachment preview broken (PDF)", customer: "Tyrell Corp.", severity: "Medium", priority: "P2", status: "Open", created: "Jul 27, 2025", assignees: ["Alex Lee"] },
    { id: 5012, title: "Timezone offsets wrong on reports", customer: "Cyberdyne", severity: "Low", priority: "P4", status: "Pending", created: "Jul 27, 2025", assignees: ["Priya Patel"] },
    { id: 5013, title: "API 429 despite backoff", customer: "Weyland-Yutani", severity: "High", priority: "P1", status: "Open", created: "Jul 26, 2025", assignees: ["Diego Ramos", "Jane Smith"] },
    { id: 5014, title: "SSO: Azure groups not mapped", customer: "Oscorp", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 26, 2025", assignees: ["Alex Lee"] },
    { id: 5015, title: "Draft replies disappear on refresh", customer: "Aperture Labs", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 25, 2025", assignees: ["Priya Patel"] },
    { id: 5016, title: "Stripe webhook secret rotated", customer: "Black Mesa", severity: "High", priority: "P1", status: "Open", created: "Jul 25, 2025", assignees: ["Brian Pluhar"] },
    { id: 5017, title: "Bulk close caps at 100 items", customer: "Vandelay", severity: "Medium", priority: "P2", status: "Open", created: "Jul 24, 2025", assignees: ["Jane Smith"] },
    { id: 5018, title: "Email imports skip cc field", customer: "Dunder Mifflin", severity: "Low", priority: "P4", status: "Resolved", created: "Jul 24, 2025", assignees: ["Alex Lee"] },
    { id: 5019, title: "Mobile editor caret jumps", customer: "Pied Piper", severity: "Medium", priority: "P3", status: "Pending", created: "Jul 23, 2025", assignees: ["Priya Patel"] },
    { id: 5020, title: "CSV import fails on emoji", customer: "Massive Dynamic", severity: "High", priority: "P1", status: "Open", created: "Jul 23, 2025", assignees: ["Diego Ramos"] },
    { id: 5021, title: "Webhook UI doesn't show logs", customer: "Blue Sun", severity: "Low", priority: "P4", status: "Resolved", created: "Jul 22, 2025", assignees: ["Jane Smith"] },
    { id: 5022, title: "Attachment upload flakes (S3)", customer: "Oceanic", severity: "Medium", priority: "P2", status: "Open", created: "Jul 22, 2025", assignees: ["Alex Lee", "Priya Patel"] },
    { id: 5023, title: "Session timeout too aggressive", customer: "Encom", severity: "Low", priority: "P4", status: "Pending", created: "Jul 21, 2025", assignees: ["Brian Pluhar"] },
    { id: 5024, title: "SSO metadata XML parse error", customer: "Nakatomi", severity: "High", priority: "P1", status: "Open", created: "Jul 21, 2025", assignees: ["Jane Smith"] },
    { id: 5025, title: "Notifications duplicate on reopen", customer: "Planet Express", severity: "Medium", priority: "P2", status: "Open", created: "Jul 20, 2025", assignees: ["Alex Lee", "Diego Ramos"] },
    { id: 5026, title: "Database connection pool exhausted", customer: "Resistance", severity: "Critical", priority: "P1", status: "Open", created: "Jul 20, 2025", assignees: ["Brian Pluhar", "Alex Lee"] },
    { id: 5027, title: "Portal gun physics broken", customer: "Interdimensional Cable", severity: "High", priority: "P1", status: "Pending", created: "Jul 19, 2025", assignees: ["Diego Ramos"] },
    { id: 5028, title: "Truth module returns false positives", customer: "FBI X-Files", severity: "High", priority: "P1", status: "Open", created: "Jul 19, 2025", assignees: ["Priya Patel", "Jane Smith"] },
    { id: 5029, title: "Red pill/blue pill UI confusing", customer: "Zion", severity: "Medium", priority: "P2", status: "Open", created: "Jul 18, 2025", assignees: ["Alex Lee"] },
    { id: 5030, title: "Tomb mapping GPS drift", customer: "Croft Enterprises", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 18, 2025", assignees: ["Jane Smith"] },
    { id: 5031, title: "Crowbar tool missing from inventory", customer: "Black Mesa Research", severity: "High", priority: "P1", status: "Open", created: "Jul 17, 2025", assignees: ["Brian Pluhar"] },
    { id: 5032, title: "Codec frequency interference", customer: "FOXHOUND", severity: "Medium", priority: "P2", status: "Resolved", created: "Jul 17, 2025", assignees: ["Priya Patel"] },
    { id: 5033, title: "Power suit energy drain too fast", customer: "Galactic Federation", severity: "High", priority: "P1", status: "Open", created: "Jul 16, 2025", assignees: ["Diego Ramos", "Alex Lee"] },
    { id: 5034, title: "Cortana voice recognition fails", customer: "UNSC", severity: "Critical", priority: "P1", status: "Open", created: "Jul 16, 2025", assignees: ["Jane Smith"] },
    { id: 5035, title: "Paragon/Renegade points not tracking", customer: "Systems Alliance", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 15, 2025", assignees: ["Alex Lee", "Priya Patel"] },
    { id: 5036, title: "File upload progress bar stuck at 99%", customer: "Acme Inc.", severity: "Low", priority: "P3", status: "Open", created: "Jul 15, 2025", assignees: ["Brian Pluhar"] },
    { id: 5037, title: "Multi-factor auth bypass vulnerability", customer: "Globex", severity: "Critical", priority: "P1", status: "Open", created: "Jul 14, 2025", assignees: ["Diego Ramos", "Jane Smith"] },
    { id: 5038, title: "API rate limiting inconsistent", customer: "Initech", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 14, 2025", assignees: ["Priya Patel"] },
    { id: 5039, title: "Dark mode toggle breaks layout", customer: "Umbrella", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 13, 2025", assignees: ["Alex Lee"] },
    { id: 5040, title: "Notification sound volume too loud", customer: "Soylent", severity: "Low", priority: "P4", status: "Open", created: "Jul 13, 2025", assignees: ["Jane Smith"] },
    { id: 5041, title: "Export to Excel corrupts formulas", customer: "Wayne Enterprises", severity: "Medium", priority: "P2", status: "Open", created: "Jul 12, 2025", assignees: ["Brian Pluhar"] },
    { id: 5042, title: "Cache invalidation race condition", customer: "Stark Industries", severity: "High", priority: "P1", status: "Pending", created: "Jul 12, 2025", assignees: ["Diego Ramos", "Alex Lee"] },
    { id: 5043, title: "Image compression artifacts", customer: "Oscorp", severity: "Medium", priority: "P2", status: "Open", created: "Jul 11, 2025", assignees: ["Priya Patel"] },
    { id: 5044, title: "Memory leak in background tasks", customer: "Weyland-Yutani", severity: "High", priority: "P1", status: "Open", created: "Jul 11, 2025", assignees: ["Jane Smith", "Brian Pluhar"] },
    { id: 5045, title: "Keyboard shortcuts conflict", customer: "Dunder Mifflin", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 10, 2025", assignees: ["Alex Lee"] },
    { id: 5046, title: "Time travel paradox in audit logs", customer: "Interdimensional Cable", severity: "Critical", priority: "P1", status: "Open", created: "Jul 10, 2025", assignees: ["Diego Ramos"] },
    { id: 5047, title: "Alien language character encoding", customer: "FBI X-Files", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 9, 2025", assignees: ["Priya Patel", "Jane Smith"] },
    { id: 5048, title: "Bullet time effect causes lag", customer: "Zion", severity: "High", priority: "P1", status: "Open", created: "Jul 9, 2025", assignees: ["Brian Pluhar"] },
    { id: 5049, title: "Ancient artifact scanner offline", customer: "Croft Enterprises", severity: "High", priority: "P1", status: "Open", created: "Jul 8, 2025", assignees: ["Alex Lee", "Diego Ramos"] },
    { id: 5050, title: "Headcrab detection false alarms", customer: "Black Mesa Research", severity: "Medium", priority: "P2", status: "Resolved", created: "Jul 8, 2025", assignees: ["Jane Smith"] },
    { id: 5051, title: "Stealth camo flickers", customer: "FOXHOUND", severity: "High", priority: "P1", status: "Pending", created: "Jul 7, 2025", assignees: ["Priya Patel"] },
    { id: 5052, title: "Morph ball gets stuck in pipes", customer: "Galactic Federation", severity: "Medium", priority: "P2", status: "Open", created: "Jul 7, 2025", assignees: ["Brian Pluhar", "Alex Lee"] },
    { id: 5053, title: "Shield recharge animation frozen", customer: "UNSC", severity: "Low", priority: "P3", status: "Open", created: "Jul 6, 2025", assignees: ["Diego Ramos"] },
    { id: 5054, title: "Mass relay navigation glitches", customer: "Systems Alliance", severity: "Critical", priority: "P1", status: "Open", created: "Jul 6, 2025", assignees: ["Jane Smith", "Priya Patel"] },
    { id: 5055, title: "User preferences reset on logout", customer: "Resistance", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 5, 2025", assignees: ["Alex Lee"] },
    { id: 5056, title: "Infinite loop in dimension calculator", customer: "Interdimensional Cable", severity: "Critical", priority: "P1", status: "Open", created: "Jul 5, 2025", assignees: ["Brian Pluhar", "Diego Ramos"] },
    { id: 5057, title: "Paranormal activity detector offline", customer: "FBI X-Files", severity: "High", priority: "P1", status: "Open", created: "Jul 4, 2025", assignees: ["Jane Smith"] },
    { id: 5058, title: "Wake up alarm doesn't work", customer: "Zion", severity: "Critical", priority: "P1", status: "Pending", created: "Jul 4, 2025", assignees: ["Priya Patel", "Alex Lee"] },
    { id: 5059, title: "Grappling hook physics unrealistic", customer: "Croft Enterprises", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 3, 2025", assignees: ["Diego Ramos"] },
    { id: 5060, title: "Lambda symbol rendering issue", customer: "Black Mesa Research", severity: "Low", priority: "P4", status: "Open", created: "Jul 3, 2025", assignees: ["Brian Pluhar"] },
    { id: 5061, title: "Cardboard box texture low-res", customer: "FOXHOUND", severity: "Low", priority: "P4", status: "Resolved", created: "Jul 2, 2025", assignees: ["Jane Smith"] },
    { id: 5062, title: "Space pirates respawn too quickly", customer: "Galactic Federation", severity: "Medium", priority: "P2", status: "Open", created: "Jul 2, 2025", assignees: ["Alex Lee", "Priya Patel"] },
    { id: 5063, title: "Covenant translator malfunction", customer: "UNSC", severity: "High", priority: "P1", status: "Open", created: "Jul 1, 2025", assignees: ["Diego Ramos"] },
    { id: 5064, title: "Squad loyalty meter inaccurate", customer: "Systems Alliance", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 1, 2025", assignees: ["Brian Pluhar", "Jane Smith"] },
    { id: 5065, title: "Time displacement calculations off", customer: "Resistance", severity: "High", priority: "P1", status: "Open", created: "Jun 30, 2025", assignees: ["Priya Patel"] },
    { id: 5066, title: "Multiverse portal coordinates wrong", customer: "Interdimensional Cable", severity: "Critical", priority: "P1", status: "Open", created: "Jun 30, 2025", assignees: ["Alex Lee", "Diego Ramos"] },
    { id: 5067, title: "Scully skepticism level too high", customer: "FBI X-Files", severity: "Low", priority: "P3", status: "Resolved", created: "Jun 29, 2025", assignees: ["Jane Smith"] },
    { id: 5068, title: "Matrix code rain color wrong", customer: "Zion", severity: "Low", priority: "P4", status: "Open", created: "Jun 29, 2025", assignees: ["Brian Pluhar"] },
    { id: 5069, title: "Dual pistol aim assistance broken", customer: "Croft Enterprises", severity: "Medium", priority: "P2", status: "Pending", created: "Jun 28, 2025", assignees: ["Priya Patel", "Alex Lee"] },
    { id: 5070, title: "G-Man speech subtitle delay", customer: "Black Mesa Research", severity: "Low", priority: "P3", status: "Open", created: "Jun 28, 2025", assignees: ["Diego Ramos"] },
    { id: 5071, title: "Nanomachine health regen too slow", customer: "FOXHOUND", severity: "Medium", priority: "P2", status: "Resolved", created: "Jun 27, 2025", assignees: ["Jane Smith"] },
    { id: 5072, title: "Scan visor battery drains quickly", customer: "Galactic Federation", severity: "Medium", priority: "P2", status: "Open", created: "Jun 27, 2025", assignees: ["Brian Pluhar", "Priya Patel"] },
    { id: 5073, title: "Grunt birthday party confetti lag", customer: "UNSC", severity: "Low", priority: "P4", status: "Pending", created: "Jun 26, 2025", assignees: ["Alex Lee"] },
    { id: 5074, title: "Normandy SR-2 engine sound loop", customer: "Systems Alliance", severity: "Low", priority: "P3", status: "Open", created: "Jun 26, 2025", assignees: ["Diego Ramos", "Jane Smith"] },
    { id: 5075, title: "Skynet connection timeout", customer: "Resistance", severity: "Critical", priority: "P1", status: "Open", created: "Jun 25, 2025", assignees: ["Brian Pluhar"] }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tickets</h1>
          {/* <p className="mt-1 text-sm text-slate-400">Track, prioritize and resolve customer issues quickly.</p> */}
        </div>
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
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{k.value}</p>
              </div>
              <span className="mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-700/30 text-slate-300 ring-1 ring-slate-600/40">—</span>
            </div>
          </Card>
        ))}
      </section>

      {/* Tickets table */}
      <section className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">All tickets</h2>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Filters
              </Link>
              <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                Columns
              </Link>
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
                {ticketRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/30">
                    <Td className="font-medium text-slate-200 whitespace-nowrap">#{r.id}</Td>
                    <Td className="max-w-[14rem] md:max-w-[28rem] truncate text-slate-200">{r.title}</Td>
                    <Td className="hidden md:table-cell">{r.customer}</Td>
                    <Td className="hidden md:table-cell"><SeverityBadge severity={r.severity} /></Td>
                    <Td className="hidden md:table-cell"><Assignees names={r.assignees} /></Td>
                    <Td className="hidden md:table-cell text-slate-400 whitespace-nowrap">{r.created}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td><PriorityBadge priority={r.priority} /></Td>
                    <Td className="text-right">
                      <button
                        type="button"
                        aria-label={`Edit ${r.id}`}
                        className="inline-flex items-center justify-center rounded-md p-1.5 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
                      >
                        <IconEdit className="h-4 w-4 text-slate-300" />
                      </button>
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

/* --------------------------------- Types -------------------------------- */

type TicketRow = {
  id: number;
  title: string;
  customer: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "P1" | "P2" | "P3" | "P4";
  status: "Open" | "Pending" | "Resolved";
  created: string; // formatted date string
  assignees: string[]; // full names; we render initials
};

/* ------------------------------ UI Helpers ------------------------------ */

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

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-sm ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: TicketRow["status"] }) {
  const map: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
    Pending: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Resolved: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[status] ?? "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40"}`}>
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: TicketRow["severity"] }) {
  const map: Record<string, string> = {
    Low: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    Medium: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    High: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Critical: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[severity]}`}>{severity}</span>
  );
}

function PriorityBadge({ priority }: { priority: TicketRow["priority"] }) {
  const map: Record<string, string> = {
    P1: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
    P2: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    P3: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    P4: "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${map[priority]}`}>{priority}</span>
  );
}

function Assignees({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.map((n) => (
        <div
          key={n}
          title={n}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-[10px] font-medium"
        >
          {initials(n)}
        </div>
      ))}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

function IconEdit(props: React.SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={`size-5 ${className ?? ''}`}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.17a4.5 4.5 0 01-1.897 1.13L6 18l.7-2.685a4.5 4.5 0 011.13-1.897l9.032-8.931z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L17.25 4.875" />
    </svg>
  );
}