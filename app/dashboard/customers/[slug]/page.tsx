import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";

/* ---------------------------------- data --------------------------------- */
type CustomerRow = {
  id: number; name: string; email: string; company: string;
  plan: string; mrr: number; status: string; created: string; lastSeen: string;
};

type TicketRow = {
  id: number; customer_id: number; title: string; customer: string;
  severity: "Low"|"Medium"|"High"|"Critical";
  priority: "P1"|"P2"|"P3"|"P4";
  status: "Open"|"Pending"|"Resolved";
  created: string; assignees: string[];
};

// --- auto-generate 200 tickets: 10 per customer ---
function generateTickets(): TicketRow[] {
  const severities = ["Low", "Medium", "High", "Critical"] as const;
  const priorities  = ["P1", "P2", "P3", "P4"] as const;
  const statuses    = ["Open", "Pending", "Resolved"] as const;

  let nextId = 5001;
  const rows: TicketRow[] = [];

  for (const cust of customerRows) {
    for (let i = 0; i < 10; i++) {
      rows.push({
        id: nextId++,
        customer_id: cust.id,
        customer: cust.company,
        title: `Sample issue #${i + 1} for ${cust.company}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created: "Aug 01, 2025",
        assignees: [],
      });
    }
  }
  return rows;
}

const ticketRows: TicketRow[] = generateTickets();

const customerRows: CustomerRow[] = [
    { id: 0, name: "Acme Admin", email: "admin@acme.io", company: "Acme Inc.", plan: "Business", mrr: 899, status: "Active", created: "Aug 01, 2025", lastSeen: "Today 09:18" },
    { id: 1, name: "Jane Smith", email: "jane@globex.com", company: "Globex", plan: "Pro", mrr: 149, status: "Active", created: "Aug 01, 2025", lastSeen: "Today 08:41" },
    { id: 2, name: "Alex Lee", email: "alex@initech.co", company: "Initech", plan: "Pro", mrr: 149, status: "Trial", created: "Jul 31, 2025", lastSeen: "Today 07:03" },
    { id: 3, name: "Priya Patel", email: "priya@umbrella.com", company: "Umbrella", plan: "Business", mrr: 699, status: "Churn risk", created: "Jul 31, 2025", lastSeen: "Yesterday 18:27" },
    { id: 4, name: "Diego Ramos", email: "diego@soylent.org", company: "Soylent", plan: "Free", mrr: 0, status: "Invited", created: "Jul 30, 2025", lastSeen: "—" },
    { id: 5, name: "Bruce Wayne", email: "bruce@wayneenterprises.com", company: "Wayne Enterprises", plan: "Business", mrr: 1299, status: "Active", created: "Jul 29, 2025", lastSeen: "Yesterday 11:10" },
    { id: 6, name: "Tony Stark", email: "tony@starkindustries.com", company: "Stark Industries", plan: "Business", mrr: 1599, status: "Active", created: "Jul 28, 2025", lastSeen: "Sun 16:02" },
    { id: 7, name: "Peter Parker", email: "peter@oscorp.com", company: "Oscorp", plan: "Pro", mrr: 149, status: "Trial", created: "Jul 27, 2025", lastSeen: "Sun 13:44" },
    { id: 8, name: "Ellen Ripley", email: "ellen@weyland.com", company: "Weyland-Yutani", plan: "Pro", mrr: 149, status: "Churn risk", created: "Jul 26, 2025", lastSeen: "Sat 21:08" },
    { id: 9, name: "Michael Scott", email: "michael@dundermifflin.com", company: "Dunder Mifflin", plan: "Free", mrr: 0, status: "Active", created: "Jul 25, 2025", lastSeen: "Sat 09:55" },
    { id: 10, name: "Sarah Connor", email: "sarah@resistance.org", company: "Resistance", plan: "Pro", mrr: 249, status: "Active", created: "Jul 24, 2025", lastSeen: "Today 14:22" },
    { id: 11, name: "Rick Sanchez", email: "rick@rickandmorty.com", company: "Interdimensional Cable", plan: "Business", mrr: 2499, status: "Active", created: "Jul 23, 2025", lastSeen: "Today 02:15" },
    { id: 12, name: "Dana Scully", email: "scully@fbi.gov", company: "FBI X-Files", plan: "Enterprise", mrr: 4999, status: "Active", created: "Jul 22, 2025", lastSeen: "Yesterday 16:45" },
    { id: 13, name: "Neo Anderson", email: "neo@matrix.net", company: "Zion", plan: "Pro", mrr: 199, status: "Trial", created: "Jul 21, 2025", lastSeen: "Today 23:59" },
    { id: 14, name: "Lara Croft", email: "lara@croftmanor.co.uk", company: "Croft Enterprises", plan: "Business", mrr: 899, status: "Active", created: "Jul 20, 2025", lastSeen: "Yesterday 12:30" },
    { id: 15, name: "Gordon Freeman", email: "gordon@blackmesa.gov", company: "Black Mesa Research", plan: "Enterprise", mrr: 3499, status: "Churn risk", created: "Jul 19, 2025", lastSeen: "Mon 08:17" },
    { id: 16, name: "Solid Snake", email: "snake@foxhound.mil", company: "FOXHOUND", plan: "Pro", mrr: 299, status: "Active", created: "Jul 18, 2025", lastSeen: "Today 06:00" },
    { id: 17, name: "Samus Aran", email: "samus@galacticfed.gov", company: "Galactic Federation", plan: "Enterprise", mrr: 5999, status: "Active", created: "Jul 17, 2025", lastSeen: "Yesterday 20:14" },
    { id: 18, name: "Master Chief", email: "chief@unsc.mil", company: "UNSC", plan: "Enterprise", mrr: 7499, status: "Active", created: "Jul 16, 2025", lastSeen: "Today 05:45" },
    { id: 19, name: "Commander Shepard", email: "shepard@alliance.mil", company: "Systems Alliance", plan: "Business", mrr: 1899, status: "Trial", created: "Jul 15, 2025", lastSeen: "Yesterday 22:33" }
  ];

// const ticketRows: TicketRow[] = [
//     { id: 5001, title: "Login fails with 500 on Safari", customer: "Acme Inc.", severity: "High", priority: "P1", status: "Open", created: "Aug 1, 2025", assignees: ["Brian Pluhar", "Jane Smith"] },
//     { id: 5002, title: "Slow dashboard load > 8s", customer: "Globex", severity: "Medium", priority: "P2", status: "Pending", created: "Aug 1, 2025", assignees: ["Alex Lee"] },
//     { id: 5003, title: "Webhook retries not firing", customer: "Initech", severity: "High", priority: "P1", status: "Open", created: "Jul 31, 2025", assignees: ["Priya Patel", "Alex Lee"] },
//     { id: 5004, title: "2FA SMS not received (EU)", customer: "Umbrella", severity: "Critical", priority: "P1", status: "Open", created: "Jul 31, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5005, title: "CSV export drops last column", customer: "Soylent", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 30, 2025", assignees: ["Jane Smith"] },
//     { id: 5006, title: "Billing page 400 on card update", customer: "Hooli", severity: "Medium", priority: "P2", status: "Open", created: "Jul 30, 2025", assignees: ["Diego Ramos"] },
//     { id: 5007, title: "SAML SSO loops back to signin", customer: "Vehement", severity: "High", priority: "P1", status: "Pending", created: "Jul 29, 2025", assignees: ["Alex Lee", "Jane Smith"] },
//     { id: 5008, title: "Email templates not saving vars", customer: "Stark Industries", severity: "Medium", priority: "P2", status: "Open", created: "Jul 29, 2025", assignees: ["Priya Patel"] },
//     { id: 5009, title: "Search returns stale results", customer: "Wayne Enterprises", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 28, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5010, title: "OAuth redirect mismatch (Google)", customer: "Wonka", severity: "High", priority: "P1", status: "Open", created: "Jul 28, 2025", assignees: ["Jane Smith"] },
//     { id: 5011, title: "Attachment preview broken (PDF)", customer: "Tyrell Corp.", severity: "Medium", priority: "P2", status: "Open", created: "Jul 27, 2025", assignees: ["Alex Lee"] },
//     { id: 5012, title: "Timezone offsets wrong on reports", customer: "Cyberdyne", severity: "Low", priority: "P4", status: "Pending", created: "Jul 27, 2025", assignees: ["Priya Patel"] },
//     { id: 5013, title: "API 429 despite backoff", customer: "Weyland-Yutani", severity: "High", priority: "P1", status: "Open", created: "Jul 26, 2025", assignees: ["Diego Ramos", "Jane Smith"] },
//     { id: 5014, title: "SSO: Azure groups not mapped", customer: "Oscorp", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 26, 2025", assignees: ["Alex Lee"] },
//     { id: 5015, title: "Draft replies disappear on refresh", customer: "Aperture Labs", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 25, 2025", assignees: ["Priya Patel"] },
//     { id: 5016, title: "Stripe webhook secret rotated", customer: "Black Mesa", severity: "High", priority: "P1", status: "Open", created: "Jul 25, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5017, title: "Bulk close caps at 100 items", customer: "Vandelay", severity: "Medium", priority: "P2", status: "Open", created: "Jul 24, 2025", assignees: ["Jane Smith"] },
//     { id: 5018, title: "Email imports skip cc field", customer: "Dunder Mifflin", severity: "Low", priority: "P4", status: "Resolved", created: "Jul 24, 2025", assignees: ["Alex Lee"] },
//     { id: 5019, title: "Mobile editor caret jumps", customer: "Pied Piper", severity: "Medium", priority: "P3", status: "Pending", created: "Jul 23, 2025", assignees: ["Priya Patel"] },
//     { id: 5020, title: "CSV import fails on emoji", customer: "Massive Dynamic", severity: "High", priority: "P1", status: "Open", created: "Jul 23, 2025", assignees: ["Diego Ramos"] },
//     { id: 5021, title: "Webhook UI doesn't show logs", customer: "Blue Sun", severity: "Low", priority: "P4", status: "Resolved", created: "Jul 22, 2025", assignees: ["Jane Smith"] },
//     { id: 5022, title: "Attachment upload flakes (S3)", customer: "Oceanic", severity: "Medium", priority: "P2", status: "Open", created: "Jul 22, 2025", assignees: ["Alex Lee", "Priya Patel"] },
//     { id: 5023, title: "Session timeout too aggressive", customer: "Encom", severity: "Low", priority: "P4", status: "Pending", created: "Jul 21, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5024, title: "SSO metadata XML parse error", customer: "Nakatomi", severity: "High", priority: "P1", status: "Open", created: "Jul 21, 2025", assignees: ["Jane Smith"] },
//     { id: 5025, title: "Notifications duplicate on reopen", customer: "Planet Express", severity: "Medium", priority: "P2", status: "Open", created: "Jul 20, 2025", assignees: ["Alex Lee", "Diego Ramos"] },
//     { id: 5026, title: "Database connection pool exhausted", customer: "Resistance", severity: "Critical", priority: "P1", status: "Open", created: "Jul 20, 2025", assignees: ["Brian Pluhar", "Alex Lee"] },
//     { id: 5027, title: "Portal gun physics broken", customer: "Interdimensional Cable", severity: "High", priority: "P1", status: "Pending", created: "Jul 19, 2025", assignees: ["Diego Ramos"] },
//     { id: 5028, title: "Truth module returns false positives", customer: "FBI X-Files", severity: "High", priority: "P1", status: "Open", created: "Jul 19, 2025", assignees: ["Priya Patel", "Jane Smith"] },
//     { id: 5029, title: "Red pill/blue pill UI confusing", customer: "Zion", severity: "Medium", priority: "P2", status: "Open", created: "Jul 18, 2025", assignees: ["Alex Lee"] },
//     { id: 5030, title: "Tomb mapping GPS drift", customer: "Croft Enterprises", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 18, 2025", assignees: ["Jane Smith"] },
//     { id: 5031, title: "Crowbar tool missing from inventory", customer: "Black Mesa Research", severity: "High", priority: "P1", status: "Open", created: "Jul 17, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5032, title: "Codec frequency interference", customer: "FOXHOUND", severity: "Medium", priority: "P2", status: "Resolved", created: "Jul 17, 2025", assignees: ["Priya Patel"] },
//     { id: 5033, title: "Power suit energy drain too fast", customer: "Galactic Federation", severity: "High", priority: "P1", status: "Open", created: "Jul 16, 2025", assignees: ["Diego Ramos", "Alex Lee"] },
//     { id: 5034, title: "Cortana voice recognition fails", customer: "UNSC", severity: "Critical", priority: "P1", status: "Open", created: "Jul 16, 2025", assignees: ["Jane Smith"] },
//     { id: 5035, title: "Paragon/Renegade points not tracking", customer: "Systems Alliance", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 15, 2025", assignees: ["Alex Lee", "Priya Patel"] },
//     { id: 5036, title: "File upload progress bar stuck at 99%", customer: "Acme Inc.", severity: "Low", priority: "P3", status: "Open", created: "Jul 15, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5037, title: "Multi-factor auth bypass vulnerability", customer: "Globex", severity: "Critical", priority: "P1", status: "Open", created: "Jul 14, 2025", assignees: ["Diego Ramos", "Jane Smith"] },
//     { id: 5038, title: "API rate limiting inconsistent", customer: "Initech", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 14, 2025", assignees: ["Priya Patel"] },
//     { id: 5039, title: "Dark mode toggle breaks layout", customer: "Umbrella", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 13, 2025", assignees: ["Alex Lee"] },
//     { id: 5040, title: "Notification sound volume too loud", customer: "Soylent", severity: "Low", priority: "P4", status: "Open", created: "Jul 13, 2025", assignees: ["Jane Smith"] },
//     { id: 5041, title: "Export to Excel corrupts formulas", customer: "Wayne Enterprises", severity: "Medium", priority: "P2", status: "Open", created: "Jul 12, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5042, title: "Cache invalidation race condition", customer: "Stark Industries", severity: "High", priority: "P1", status: "Pending", created: "Jul 12, 2025", assignees: ["Diego Ramos", "Alex Lee"] },
//     { id: 5043, title: "Image compression artifacts", customer: "Oscorp", severity: "Medium", priority: "P2", status: "Open", created: "Jul 11, 2025", assignees: ["Priya Patel"] },
//     { id: 5044, title: "Memory leak in background tasks", customer: "Weyland-Yutani", severity: "High", priority: "P1", status: "Open", created: "Jul 11, 2025", assignees: ["Jane Smith", "Brian Pluhar"] },
//     { id: 5045, title: "Keyboard shortcuts conflict", customer: "Dunder Mifflin", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 10, 2025", assignees: ["Alex Lee"] },
//     { id: 5046, title: "Time travel paradox in audit logs", customer: "Interdimensional Cable", severity: "Critical", priority: "P1", status: "Open", created: "Jul 10, 2025", assignees: ["Diego Ramos"] },
//     { id: 5047, title: "Alien language character encoding", customer: "FBI X-Files", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 9, 2025", assignees: ["Priya Patel", "Jane Smith"] },
//     { id: 5048, title: "Bullet time effect causes lag", customer: "Zion", severity: "High", priority: "P1", status: "Open", created: "Jul 9, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5049, title: "Ancient artifact scanner offline", customer: "Croft Enterprises", severity: "High", priority: "P1", status: "Open", created: "Jul 8, 2025", assignees: ["Alex Lee", "Diego Ramos"] },
//     { id: 5050, title: "Headcrab detection false alarms", customer: "Black Mesa Research", severity: "Medium", priority: "P2", status: "Resolved", created: "Jul 8, 2025", assignees: ["Jane Smith"] },
//     { id: 5051, title: "Stealth camo flickers", customer: "FOXHOUND", severity: "High", priority: "P1", status: "Pending", created: "Jul 7, 2025", assignees: ["Priya Patel"] },
//     { id: 5052, title: "Morph ball gets stuck in pipes", customer: "Galactic Federation", severity: "Medium", priority: "P2", status: "Open", created: "Jul 7, 2025", assignees: ["Brian Pluhar", "Alex Lee"] },
//     { id: 5053, title: "Shield recharge animation frozen", customer: "UNSC", severity: "Low", priority: "P3", status: "Open", created: "Jul 6, 2025", assignees: ["Diego Ramos"] },
//     { id: 5054, title: "Mass relay navigation glitches", customer: "Systems Alliance", severity: "Critical", priority: "P1", status: "Open", created: "Jul 6, 2025", assignees: ["Jane Smith", "Priya Patel"] },
//     { id: 5055, title: "User preferences reset on logout", customer: "Resistance", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 5, 2025", assignees: ["Alex Lee"] },
//     { id: 5056, title: "Infinite loop in dimension calculator", customer: "Interdimensional Cable", severity: "Critical", priority: "P1", status: "Open", created: "Jul 5, 2025", assignees: ["Brian Pluhar", "Diego Ramos"] },
//     { id: 5057, title: "Paranormal activity detector offline", customer: "FBI X-Files", severity: "High", priority: "P1", status: "Open", created: "Jul 4, 2025", assignees: ["Jane Smith"] },
//     { id: 5058, title: "Wake up alarm doesn't work", customer: "Zion", severity: "Critical", priority: "P1", status: "Pending", created: "Jul 4, 2025", assignees: ["Priya Patel", "Alex Lee"] },
//     { id: 5059, title: "Grappling hook physics unrealistic", customer: "Croft Enterprises", severity: "Low", priority: "P3", status: "Resolved", created: "Jul 3, 2025", assignees: ["Diego Ramos"] },
//     { id: 5060, title: "Lambda symbol rendering issue", customer: "Black Mesa Research", severity: "Low", priority: "P4", status: "Open", created: "Jul 3, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5061, title: "Cardboard box texture low-res", customer: "FOXHOUND", severity: "Low", priority: "P4", status: "Resolved", created: "Jul 2, 2025", assignees: ["Jane Smith"] },
//     { id: 5062, title: "Space pirates respawn too quickly", customer: "Galactic Federation", severity: "Medium", priority: "P2", status: "Open", created: "Jul 2, 2025", assignees: ["Alex Lee", "Priya Patel"] },
//     { id: 5063, title: "Covenant translator malfunction", customer: "UNSC", severity: "High", priority: "P1", status: "Open", created: "Jul 1, 2025", assignees: ["Diego Ramos"] },
//     { id: 5064, title: "Squad loyalty meter inaccurate", customer: "Systems Alliance", severity: "Medium", priority: "P2", status: "Pending", created: "Jul 1, 2025", assignees: ["Brian Pluhar", "Jane Smith"] },
//     { id: 5065, title: "Time displacement calculations off", customer: "Resistance", severity: "High", priority: "P1", status: "Open", created: "Jun 30, 2025", assignees: ["Priya Patel"] },
//     { id: 5066, title: "Multiverse portal coordinates wrong", customer: "Interdimensional Cable", severity: "Critical", priority: "P1", status: "Open", created: "Jun 30, 2025", assignees: ["Alex Lee", "Diego Ramos"] },
//     { id: 5067, title: "Scully skepticism level too high", customer: "FBI X-Files", severity: "Low", priority: "P3", status: "Resolved", created: "Jun 29, 2025", assignees: ["Jane Smith"] },
//     { id: 5068, title: "Matrix code rain color wrong", customer: "Zion", severity: "Low", priority: "P4", status: "Open", created: "Jun 29, 2025", assignees: ["Brian Pluhar"] },
//     { id: 5069, title: "Dual pistol aim assistance broken", customer: "Croft Enterprises", severity: "Medium", priority: "P2", status: "Pending", created: "Jun 28, 2025", assignees: ["Priya Patel", "Alex Lee"] },
//     { id: 5070, title: "G-Man speech subtitle delay", customer: "Black Mesa Research", severity: "Low", priority: "P3", status: "Open", created: "Jun 28, 2025", assignees: ["Diego Ramos"] },
//     { id: 5071, title: "Nanomachine health regen too slow", customer: "FOXHOUND", severity: "Medium", priority: "P2", status: "Resolved", created: "Jun 27, 2025", assignees: ["Jane Smith"] },
//     { id: 5072, title: "Scan visor battery drains quickly", customer: "Galactic Federation", severity: "Medium", priority: "P2", status: "Open", created: "Jun 27, 2025", assignees: ["Brian Pluhar", "Priya Patel"] },
//     { id: 5073, title: "Grunt birthday party confetti lag", customer: "UNSC", severity: "Low", priority: "P4", status: "Pending", created: "Jun 26, 2025", assignees: ["Alex Lee"] },
//     { id: 5074, title: "Normandy SR-2 engine sound loop", customer: "Systems Alliance", severity: "Low", priority: "P3", status: "Open", created: "Jun 26, 2025", assignees: ["Diego Ramos", "Jane Smith"] },
//     { id: 5075, title: "Skynet connection timeout", customer: "Resistance", severity: "Critical", priority: "P1", status: "Open", created: "Jun 25, 2025", assignees: ["Brian Pluhar"] }
//   ];

function usd(n:number){return n===0?"$0":`$${n.toLocaleString()}`}

/* -------------------------------- component ------------------------------ */
export default async function Page({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = Number(slug);
  const customer = customerRows.find(c => c.id === id);
  if (!customer) notFound();

  const tickets = ticketRows.filter(t => t.customer === customer.company);
  const lastDate =
    tickets.length
      ? tickets
          .map(t => new Date(t.created))
          .sort((a,b)=>b.getTime()-a.getTime())[0]
          .toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
      : "—";

  const kpis = [
    { label: "Tickets",      value: String(tickets.length) },
    { label: "Last ticket",  value: lastDate },
    { label: "MRR",          value: usd(customer.mrr) },
    { label: "Customer since", value: customer.created },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* ---- header ---- */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          {/* <p className="mt-1 text-sm text-slate-400">{customer.company}</p> */}
        </div>

        <Link
          href={`mailto:${customer.email}`}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
        >
          Email
        </Link>
      </div>

      {/* ---- KPI cards ---- */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(k => (
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

      {/* ---- main + sidebar ---- */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* -- Tickets (left, 2/3) -- */}
        <section className="lg:col-span-2">
          <Card>
            <h2 className="text-sm font-medium text-slate-300 mb-4">Tickets</h2>
            <div className="overflow-x-auto rounded-md border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-400">
                  <tr>
                    <Th>ID</Th><Th>Title</Th>
                    <Th className="hidden md:table-cell">Severity</Th>
                    <Th className="hidden md:table-cell">Priority</Th>
                    <Th>Status</Th>
                    <Th className="hidden md:table-cell">Created</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-900/30">
                      <Td className="whitespace-nowrap">#{t.id}</Td>
                      <Td className="max-w-[20rem] truncate">{t.title}</Td>
                      <Td className="hidden md:table-cell"><Severity severity={t.severity} /></Td>
                      <Td className="hidden md:table-cell">{t.priority}</Td>
                      <Td><Status status={t.status} /></Td>
                      <Td className="hidden md:table-cell text-slate-400 whitespace-nowrap">{t.created}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* -- Sidebar (right, 1/3) -- */}
        <aside className="space-y-6">

          {/* Quick Actions */}
          <Card>
            <h2 className="text-sm font-medium text-slate-300 mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <button className="mt-2 w-full rounded-md border border-transparent bg-[#249F73] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]">
                New Ticket
              </button>
              <button className="rounded-md bg-slate-800/60 px-3 py-2 text-xs font-medium ring-1 ring-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600">
                Add Note
              </button>
              <button className="rounded-md bg-slate-800/60 px-3 py-2 text-xs font-medium ring-1 ring-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600">
                Send Email
              </button>
            </div>
          </Card>

          {/* Customer Information */}
          <Card>
            <h2 className="text-sm font-medium text-slate-300 mb-3">Customer Information</h2>
            <form className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  defaultValue={customer.name}
                  className="w-full rounded-md bg-slate-800/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Email</label>
                <input
                  type="email"
                  defaultValue={customer.email}
                  className="w-full rounded-md bg-slate-800/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">Company</label>
                <input
                  type="text"
                  defaultValue={customer.company}
                  className="w-full rounded-md bg-slate-800/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-md border border-transparent bg-[#249F73] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                Save Changes
              </button>
            </form>
          </Card>

        </aside>
      </div>
    </div>
  );
}

/* ---- tiny helpers ---- */
function Card({children}:{children:React.ReactNode}){return <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">{children}</div>}
function Th({children,className=""}:{children:React.ReactNode,className?:string}){return <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wide ${className}`}>{children}</th>}
function Td({children,className=""}:{children:React.ReactNode,className?:string}){return <td className={`px-3 py-2 text-sm ${className}`}>{children}</td>}
function Status({status}:{status:TicketRow["status"]}){const m={Open:"bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",Pending:"bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",Resolved:"bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"};return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${m[status]}`}>{status}</span>;}
function Severity({severity}:{severity:TicketRow["severity"]}){const m={Low:"bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",Medium:"bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",High:"bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",Critical:"bg-red-500/10 text-red-400 ring-1 ring-red-500/30"};return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${m[severity]}`}>{severity}</span>;}