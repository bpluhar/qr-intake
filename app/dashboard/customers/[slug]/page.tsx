import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import Breadcrumbs from "../../helpers/Breadcrumbs";
import { PriorityBadge, SeverityBadge, StatusBadge } from "../../badges";

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

const ticketRows: TicketRow[] = [
  // ---- Customer 0: Acme Inc. ----
  { id: 5001,  customer_id: 0,  customer: "Acme Inc.",             title: "Login fails with 500 on Safari",          severity: "High",    priority: "P1", status: "Open",     created: "Aug 01, 2025", assignees: ["Brian Pluhar","Jane Smith"] },
  { id: 5002,  customer_id: 0,  customer: "Acme Inc.",             title: "Two‑factor codes delayed >60 s",          severity: "Medium",  priority: "P2", status: "Pending",  created: "Aug 01, 2025", assignees: ["Alex Lee"] },
  { id: 5003,  customer_id: 0,  customer: "Acme Inc.",             title: "Invoice PDF totals mis‑rounded",          severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 31, 2025", assignees: ["Priya Patel"] },
  { id: 5004,  customer_id: 0,  customer: "Acme Inc.",             title: "Webhook retries stuck in loop",           severity: "High",    priority: "P1", status: "Open",     created: "Jul 31, 2025", assignees: ["Diego Ramos"] },
  { id: 5005,  customer_id: 0,  customer: "Acme Inc.",             title: "Dashboard widgets flicker on Chrome 126",severity: "Low",     priority: "P4", status: "Pending",  created: "Jul 30, 2025", assignees: ["Jane Smith"] },
  { id: 5006,  customer_id: 0,  customer: "Acme Inc.",             title: "SSO SAML response invalid signature",     severity: "Critical",priority: "P1", status: "Open",     created: "Jul 30, 2025", assignees: ["Brian Pluhar"] },
  { id: 5007,  customer_id: 0,  customer: "Acme Inc.",             title: "CSV export drops last column",            severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 29, 2025", assignees: ["Priya Patel"] },
  { id: 5008,  customer_id: 0,  customer: "Acme Inc.",             title: "Audit log timestamps off by ‑4 h",        severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 29, 2025", assignees: ["Alex Lee"] },
  { id: 5009,  customer_id: 0,  customer: "Acme Inc.",             title: "Rate‑limit 429 despite back‑off",        severity: "High",    priority: "P1", status: "Pending",  created: "Jul 28, 2025", assignees: ["Jane Smith"] },
  { id: 5010,  customer_id: 0,  customer: "Acme Inc.",             title: "Billing page 400 on card update",        severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 28, 2025", assignees: ["Diego Ramos"] },

  // ---- Customer 1: Globex ----
  { id: 5011,  customer_id: 1,  customer: "Globex",                title: "Slow dashboard load >8 s",                severity: "Medium",  priority: "P2", status: "Open",     created: "Aug 01, 2025", assignees: ["Alex Lee"] },
  { id: 5012,  customer_id: 1,  customer: "Globex",                title: "Bulk delete caps at 100 items",           severity: "Low",     priority: "P4", status: "Resolved", created: "Aug 01, 2025", assignees: ["Priya Patel"] },
  { id: 5013,  customer_id: 1,  customer: "Globex",                title: "Webhook UI shows no logs",                severity: "Low",     priority: "P3", status: "Pending",  created: "Jul 31, 2025", assignees: ["Brian Pluhar"] },
  { id: 5014,  customer_id: 1,  customer: "Globex",                title: "SSO metadata XML parse error",            severity: "High",    priority: "P1", status: "Open",     created: "Jul 31, 2025", assignees: ["Jane Smith"] },
  { id: 5015,  customer_id: 1,  customer: "Globex",                title: "Duplicate notifications on reopen",      severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 30, 2025", assignees: ["Alex Lee"] },
  { id: 5016,  customer_id: 1,  customer: "Globex",                title: "API 429 despite proper back‑off",         severity: "High",    priority: "P1", status: "Open",     created: "Jul 30, 2025", assignees: ["Diego Ramos"] },
  { id: 5017,  customer_id: 1,  customer: "Globex",                title: "Dark‑mode toggle breaks layout",          severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 29, 2025", assignees: ["Alex Lee"] },
  { id: 5018,  customer_id: 1,  customer: "Globex",                title: "Notification sound too loud",            severity: "Low",     priority: "P4", status: "Open",     created: "Jul 29, 2025", assignees: ["Jane Smith"] },
  { id: 5019,  customer_id: 1,  customer: "Globex",                title: "Multi‑factor auth bypass",               severity: "Critical",priority: "P1", status: "Open",     created: "Jul 28, 2025", assignees: ["Diego Ramos"] },
  { id: 5020,  customer_id: 1,  customer: "Globex",                title: "Time‑travel paradox in audit logs",       severity: "Critical",priority: "P1", status: "Pending",  created: "Jul 28, 2025", assignees: ["Priya Patel"] },

  // ---- Customer 2: Initech ----
  { id: 5021,  customer_id: 2,  customer: "Initech",               title: "Webhook retries not firing",              severity: "High",    priority: "P1", status: "Open",     created: "Jul 31, 2025", assignees: ["Priya Patel","Alex Lee"] },
  { id: 5022,  customer_id: 2,  customer: "Initech",               title: "CSV import fails on emoji",               severity: "High",    priority: "P1", status: "Pending",  created: "Jul 31, 2025", assignees: ["Priya Patel"] },
  { id: 5023,  customer_id: 2,  customer: "Initech",               title: "API rate limiting inconsistent",          severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 30, 2025", assignees: ["Priya Patel"] },
  { id: 5024,  customer_id: 2,  customer: "Initech",               title: "Billing page 400 on card update",         severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 30, 2025", assignees: ["Diego Ramos"] },
  { id: 5025,  customer_id: 2,  customer: "Initech",               title: "Draft replies disappear on refresh",      severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 29, 2025", assignees: ["Priya Patel"] },
  { id: 5026,  customer_id: 2,  customer: "Initech",               title: "Cache invalidation race condition",       severity: "High",    priority: "P1", status: "Pending",  created: "Jul 29, 2025", assignees: ["Alex Lee"] },
  { id: 5027,  customer_id: 2,  customer: "Initech",               title: "Image compression artifacts",             severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 28, 2025", assignees: ["Priya Patel"] },
  { id: 5028,  customer_id: 2,  customer: "Initech",               title: "Memory leak in background tasks",         severity: "High",    priority: "P1", status: "Open",     created: "Jul 28, 2025", assignees: ["Jane Smith","Brian Pluhar"] },
  { id: 5029,  customer_id: 2,  customer: "Initech",               title: "Keyboard shortcuts conflict",             severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 27, 2025", assignees: ["Alex Lee"] },
  { id: 5030,  customer_id: 2,  customer: "Initech",               title: "Webhook secret rotation failure",         severity: "High",    priority: "P1", status: "Open",     created: "Jul 27, 2025", assignees: ["Brian Pluhar"] },

  // ---- Customer 3: Umbrella ----
  { id: 5031,  customer_id: 3,  customer: "Umbrella",              title: "2FA SMS not received (EU)",               severity: "Critical",priority: "P1", status: "Open",     created: "Jul 31, 2025", assignees: ["Brian Pluhar"] },
  { id: 5032,  customer_id: 3,  customer: "Umbrella",              title: "Truth module returns false positives",    severity: "High",    priority: "P1", status: "Open",     created: "Jul 31, 2025", assignees: ["Priya Patel","Jane Smith"] },
  { id: 5033,  customer_id: 3,  customer: "Umbrella",              title: "Red‑pill / blue‑pill UI confusing",       severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 30, 2025", assignees: ["Alex Lee"] },
  { id: 5034,  customer_id: 3,  customer: "Umbrella",              title: "Tomb mapping GPS drift",                  severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 30, 2025", assignees: ["Jane Smith"] },
  { id: 5035,  customer_id: 3,  customer: "Umbrella",              title: "Crowbar tool missing from inventory",     severity: "High",    priority: "P1", status: "Open",     created: "Jul 29, 2025", assignees: ["Brian Pluhar"] },
  { id: 5036,  customer_id: 3,  customer: "Umbrella",              title: "Codec frequency interference",            severity: "Medium",  priority: "P2", status: "Resolved", created: "Jul 29, 2025", assignees: ["Priya Patel"] },
  { id: 5037,  customer_id: 3,  customer: "Umbrella",              title: "Power‑suit energy drain too fast",        severity: "High",    priority: "P1", status: "Open",     created: "Jul 28, 2025", assignees: ["Diego Ramos","Alex Lee"] },
  { id: 5038,  customer_id: 3,  customer: "Umbrella",              title: "Cortana voice recognition fails",         severity: "Critical",priority: "P1", status: "Open",     created: "Jul 28, 2025", assignees: ["Jane Smith"] },
  { id: 5039,  customer_id: 3,  customer: "Umbrella",              title: "Paragon / Renegade points not tracking",  severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 27, 2025", assignees: ["Alex Lee","Priya Patel"] },
  { id: 5040,  customer_id: 3,  customer: "Umbrella",              title: "Upload progress bar stuck at 99 %",       severity: "Low",     priority: "P3", status: "Open",     created: "Jul 27, 2025", assignees: ["Brian Pluhar"] },

  // ---- Customer 4: Soylent ----
  { id: 5041,  customer_id: 4,  customer: "Soylent",               title: "CSV export drops last column",            severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 30, 2025", assignees: ["Jane Smith"] },
  { id: 5042,  customer_id: 4,  customer: "Soylent",               title: "Notification sound volume too loud",      severity: "Low",     priority: "P4", status: "Open",     created: "Jul 30, 2025", assignees: ["Jane Smith"] },
  { id: 5043,  customer_id: 4,  customer: "Soylent",               title: "Export to Excel corrupts formulas",       severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 29, 2025", assignees: ["Brian Pluhar"] },
  { id: 5044,  customer_id: 4,  customer: "Soylent",               title: "Image compression artifacts",             severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 29, 2025", assignees: ["Priya Patel"] },
  { id: 5045,  customer_id: 4,  customer: "Soylent",               title: "Memory leak in background tasks",         severity: "High",    priority: "P1", status: "Open",     created: "Jul 28, 2025", assignees: ["Jane Smith","Brian Pluhar"] },
  { id: 5046,  customer_id: 4,  customer: "Soylent",               title: "Keyboard shortcuts conflict",             severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 28, 2025", assignees: ["Alex Lee"] },
  { id: 5047,  customer_id: 4,  customer: "Soylent",               title: "Time‑travel paradox in logs",             severity: "Critical",priority: "P1", status: "Open",     created: "Jul 27, 2025", assignees: ["Diego Ramos"] },
  { id: 5048,  customer_id: 4,  customer: "Soylent",               title: "Alien language encoding fails",           severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 27, 2025", assignees: ["Priya Patel","Jane Smith"] },
  { id: 5049,  customer_id: 4,  customer: "Soylent",               title: "Bullet‑time effect causes lag",           severity: "High",    priority: "P1", status: "Open",     created: "Jul 26, 2025", assignees: ["Brian Pluhar"] },
  { id: 5050,  customer_id: 4,  customer: "Soylent",               title: "Artifact scanner offline",                severity: "High",    priority: "P1", status: "Open",     created: "Jul 26, 2025", assignees: ["Alex Lee","Diego Ramos"] },

  // ---- Customer 5: Wayne Enterprises ----
  { id: 5051,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Search returns stale results",            severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 28, 2025", assignees: ["Brian Pluhar"] },
  { id: 5052,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Headcrab detection false alarms",         severity: "Medium",  priority: "P2", status: "Resolved", created: "Jul 28, 2025", assignees: ["Jane Smith"] },
  { id: 5053,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Stealth camo flickers",                   severity: "High",    priority: "P1", status: "Pending",  created: "Jul 27, 2025", assignees: ["Priya Patel"] },
  { id: 5054,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Morph‑ball gets stuck in pipes",          severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 27, 2025", assignees: ["Brian Pluhar","Alex Lee"] },
  { id: 5055,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Shield recharge animation frozen",        severity: "Low",     priority: "P3", status: "Open",     created: "Jul 26, 2025", assignees: ["Diego Ramos"] },
  { id: 5056,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Mass relay nav glitch",                   severity: "Critical",priority: "P1", status: "Open",     created: "Jul 26, 2025", assignees: ["Jane Smith","Priya Patel"] },
  { id: 5057,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Preferences reset on logout",             severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 25, 2025", assignees: ["Alex Lee"] },
  { id: 5058,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Infinite loop in dimension calc",         severity: "Critical",priority: "P1", status: "Open",     created: "Jul 25, 2025", assignees: ["Brian Pluhar","Diego Ramos"] },
  { id: 5059,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Paranormal detector offline",             severity: "High",    priority: "P1", status: "Open",     created: "Jul 24, 2025", assignees: ["Jane Smith"] },
  { id: 5060,  customer_id: 5,  customer: "Wayne Enterprises",     title: "Wake‑up alarm doesn't work",              severity: "Critical",priority: "P1", status: "Pending",  created: "Jul 24, 2025", assignees: ["Priya Patel","Alex Lee"] },

  // ---- Customer 6: Stark Industries ----
  { id: 5061,  customer_id: 6,  customer: "Stark Industries",      title: "Email templates not saving vars",         severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 29, 2025", assignees: ["Priya Patel"] },
  { id: 5062,  customer_id: 6,  customer: "Stark Industries",      title: "Lambda symbol rendering issue",           severity: "Low",     priority: "P4", status: "Open",     created: "Jul 29, 2025", assignees: ["Brian Pluhar"] },
  { id: 5063,  customer_id: 6,  customer: "Stark Industries",      title: "Cardboard box texture low‑res",           severity: "Low",     priority: "P4", status: "Resolved", created: "Jul 28, 2025", assignees: ["Jane Smith"] },
  { id: 5064,  customer_id: 6,  customer: "Stark Industries",      title: "Space pirate respawn too quick",          severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 28, 2025", assignees: ["Alex Lee","Priya Patel"] },
  { id: 5065,  customer_id: 6,  customer: "Stark Industries",      title: "Covenant translator malfunction",         severity: "High",    priority: "P1", status: "Open",     created: "Jul 27, 2025", assignees: ["Diego Ramos"] },
  { id: 5066,  customer_id: 6,  customer: "Stark Industries",      title: "Squad loyalty meter inaccurate",          severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 27, 2025", assignees: ["Brian Pluhar","Jane Smith"] },
  { id: 5067,  customer_id: 6,  customer: "Stark Industries",      title: "Time displacement calculations off",      severity: "High",    priority: "P1", status: "Open",     created: "Jul 26, 2025", assignees: ["Priya Patel"] },
  { id: 5068,  customer_id: 6,  customer: "Stark Industries",      title: "Matrix code rain wrong colour",           severity: "Low",     priority: "P4", status: "Open",     created: "Jul 26, 2025", assignees: ["Brian Pluhar"] },
  { id: 5069,  customer_id: 6,  customer: "Stark Industries",      title: "Dual pistol aim‑assist broken",           severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 25, 2025", assignees: ["Priya Patel","Alex Lee"] },
  { id: 5070,  customer_id: 6,  customer: "Stark Industries",      title: "G‑Man subtitle delay",                    severity: "Low",     priority: "P3", status: "Open",     created: "Jul 25, 2025", assignees: ["Diego Ramos"] },

  // ---- Customer 7: Oscorp ----
  { id: 5071,  customer_id: 7,  customer: "Oscorp",                title: "OAuth redirect mismatch (Google)",       severity: "High",    priority: "P1", status: "Open",     created: "Jul 28, 2025", assignees: ["Jane Smith"] },
  { id: 5072,  customer_id: 7,  customer: "Oscorp",                title: "SSO groups not mapped (AAD)",            severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 28, 2025", assignees: ["Alex Lee"] },
  { id: 5073,  customer_id: 7,  customer: "Oscorp",                title: "URL preview broken on mobile",           severity: "Low",     priority: "P3", status: "Open",     created: "Jul 27, 2025", assignees: ["Priya Patel"] },
  { id: 5074,  customer_id: 7,  customer: "Oscorp",                title: "Attachment preview broken (PDF)",        severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 27, 2025", assignees: ["Alex Lee"] },
  { id: 5075,  customer_id: 7,  customer: "Oscorp",                title: "Upload progress bar stuck",              severity: "Low",     priority: "P3", status: "Open",     created: "Jul 26, 2025", assignees: ["Brian Pluhar"] },
  { id: 5076,  customer_id: 7,  customer: "Oscorp",                title: "Multi‑tab session collision",            severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 26, 2025", assignees: ["Priya Patel"] },
  { id: 5077,  customer_id: 7,  customer: "Oscorp",                title: "Dark‑mode images inverted",              severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 25, 2025", assignees: ["Jane Smith"] },
  { id: 5078,  customer_id: 7,  customer: "Oscorp",                title: "User avatars not caching",               severity: "Low",     priority: "P4", status: "Pending",  created: "Jul 25, 2025", assignees: ["Alex Lee"] },
  { id: 5079,  customer_id: 7,  customer: "Oscorp",                title: "Email notifications inconsistent",       severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 24, 2025", assignees: ["Priya Patel"] },
  { id: 5080,  customer_id: 7,  customer: "Oscorp",                title: "Audit logs missing IPs",                 severity: "High",    priority: "P1", status: "Open",     created: "Jul 24, 2025", assignees: ["Diego Ramos"] },

  // ---- Customer 8: Weyland‑Yutani ----
  { id: 5081,  customer_id: 8,  customer: "Weyland-Yutani",        title: "API 429 despite back‑off",               severity: "High",    priority: "P1", status: "Open",     created: "Jul 26, 2025", assignees: ["Diego Ramos","Jane Smith"] },
  { id: 5082,  customer_id: 8,  customer: "Weyland-Yutani",        title: "SSO metadata XML parse error",           severity: "High",    priority: "P1", status: "Open",     created: "Jul 26, 2025", assignees: ["Jane Smith"] },
  { id: 5083,  customer_id: 8,  customer: "Weyland-Yutani",        title: "CSV export drops last column",           severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 25, 2025", assignees: ["Priya Patel"] },
  { id: 5084,  customer_id: 8,  customer: "Weyland-Yutani",        title: "Email templates not saving vars",        severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 25, 2025", assignees: ["Alex Lee"] },
  { id: 5085,  customer_id: 8,  customer: "Weyland-Yutani",        title: "Attachment preview broken",              severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 24, 2025", assignees: ["Brian Pluhar"] },
  { id: 5086,  customer_id: 8,  customer: "Weyland-Yutani",        title: "Timezone offsets wrong in reports",      severity: "Low",     priority: "P4", status: "Pending",  created: "Jul 24, 2025", assignees: ["Priya Patel"] },
  { id: 5087,  customer_id: 8,  customer: "Weyland-Yutani",        title: "Search returns stale results",           severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 23, 2025", assignees: ["Brian Pluhar"] },
  { id: 5088,  customer_id: 8,  customer: "Weyland-Yutani",        title: "Webhook UI doesn't show logs",           severity: "Low",     priority: "P4", status: "Resolved", created: "Jul 23, 2025", assignees: ["Jane Smith"] },
  { id: 5089,  customer_id: 8,  customer: "Weyland-Yutani",        title: "Billing errors on auto‑renew",           severity: "High",    priority: "P1", status: "Open",     created: "Jul 22, 2025", assignees: ["Diego Ramos"] },
  { id: 5090,  customer_id: 8,  customer: "Weyland-Yutani",        title: "API keys not regenerating",              severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 22, 2025", assignees: ["Priya Patel"] },

  // ---- Customer 9: Dunder Mifflin ----
  { id: 5091,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Email imports skip CC field",            severity: "Low",     priority: "P4", status: "Resolved", created: "Jul 24, 2025", assignees: ["Alex Lee"] },
  { id: 5092,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Keyboard shortcuts conflict",            severity: "Low",     priority: "P3", status: "Resolved", created: "Jul 24, 2025", assignees: ["Alex Lee"] },
  { id: 5093,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Search indexing lag",                    severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 23, 2025", assignees: ["Priya Patel"] },
  { id: 5094,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Audit log IP missing",                   severity: "Low",     priority: "P4", status: "Pending",  created: "Jul 23, 2025", assignees: ["Brian Pluhar"] },
  { id: 5095,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Webhook secret rotation failure",        severity: "High",    priority: "P1", status: "Open",     created: "Jul 22, 2025", assignees: ["Diego Ramos"] },
  { id: 5096,  customer_id: 9,  customer: "Dunder Mifflin",        title: "PPT export corrupts",                    severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 22, 2025", assignees: ["Jane Smith"] },
  { id: 5097,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Report builder freezes",                 severity: "Low",     priority: "P3", status: "Open",     created: "Jul 21, 2025", assignees: ["Alex Lee"] },
  { id: 5098,  customer_id: 9,  customer: "Dunder Mifflin",        title: "SAML SSO loops back to sign‑in",         severity: "High",    priority: "P1", status: "Pending",  created: "Jul 21, 2025", assignees: ["Priya Patel"] },
  { id: 5099,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Bulk close caps at 100",                 severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 20, 2025", assignees: ["Jane Smith"] },
  { id: 5100,  customer_id: 9,  customer: "Dunder Mifflin",        title: "Email templates not saving vars",        severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 20, 2025", assignees: ["Priya Patel"] },

  // ---- Customer 10: Resistance ----
  { id: 5101,  customer_id: 10, customer: "Resistance",            title: "Database connection pool exhausted",     severity: "Critical",priority: "P1", status: "Open",     created: "Jul 20, 2025", assignees: ["Brian Pluhar","Alex Lee"] },
  { id: 5102,  customer_id: 10, customer: "Resistance",            title: "Stripe webhook secret rotated",          severity: "High",    priority: "P1", status: "Open",     created: "Jul 25, 2025", assignees: ["Brian Pluhar"] },
  { id: 5103,  customer_id: 10, customer: "Resistance",            title: "Skynet connection timeout",             severity: "Critical",priority: "P1", status: "Open",     created: "Jun 25, 2025", assignees: ["Brian Pluhar"] },
  { id: 5104,  customer_id: 10, customer: "Resistance",            title: "Wake‑up alarm inactivity",               severity: "Critical",priority: "P1", status: "Pending",  created: "Jul 04, 2025", assignees: ["Priya Patel","Alex Lee"] },
  { id: 5105,  customer_id: 10, customer: "Resistance",            title: "User preferences reset on logout",       severity: "Medium",  priority: "P2", status: "Pending",  created: "Jul 05, 2025", assignees: ["Alex Lee"] },
  { id: 5106,  customer_id: 10, customer: "Resistance",            title: "Interface lag after deploy",             severity: "Medium",  priority: "P2", status: "Open",     created: "Jul 14, 2025", assignees: ["Priya Patel"] },
  { id: 5107,  customer_id: 10, customer: "Resistance",            title: "OAuth token refresh loop",              severity: "High",    priority: "P1", status: "Open",     created: "Jul 16, 2025", assignees: ["Diego Ramos"] },
  { id: 5108,  customer_id: 10, customer: "Resistance",            title: "API latency spikes",                     severity: "High",    priority: "P1", status: "Pending",  created: "Jul 18, 2025", assignees: []},
];

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
    // { id: 11, name: "Rick Sanchez", email: "rick@rickandmorty.com", company: "Interdimensional Cable", plan: "Business", mrr: 2499, status: "Active", created: "Jul 23, 2025", lastSeen: "Today 02:15" },
    // { id: 12, name: "Dana Scully", email: "scully@fbi.gov", company: "FBI X-Files", plan: "Enterprise", mrr: 4999, status: "Active", created: "Jul 22, 2025", lastSeen: "Yesterday 16:45" },
    // { id: 13, name: "Neo Anderson", email: "neo@matrix.net", company: "Zion", plan: "Pro", mrr: 199, status: "Trial", created: "Jul 21, 2025", lastSeen: "Today 23:59" },
    // { id: 14, name: "Lara Croft", email: "lara@croftmanor.co.uk", company: "Croft Enterprises", plan: "Business", mrr: 899, status: "Active", created: "Jul 20, 2025", lastSeen: "Yesterday 12:30" },
    // { id: 15, name: "Gordon Freeman", email: "gordon@blackmesa.gov", company: "Black Mesa Research", plan: "Enterprise", mrr: 3499, status: "Churn risk", created: "Jul 19, 2025", lastSeen: "Mon 08:17" },
    // { id: 16, name: "Solid Snake", email: "snake@foxhound.mil", company: "FOXHOUND", plan: "Pro", mrr: 299, status: "Active", created: "Jul 18, 2025", lastSeen: "Today 06:00" },
    // { id: 17, name: "Samus Aran", email: "samus@galacticfed.gov", company: "Galactic Federation", plan: "Enterprise", mrr: 5999, status: "Active", created: "Jul 17, 2025", lastSeen: "Yesterday 20:14" },
    // { id: 18, name: "Master Chief", email: "chief@unsc.mil", company: "UNSC", plan: "Enterprise", mrr: 7499, status: "Active", created: "Jul 16, 2025", lastSeen: "Today 05:45" },
    // { id: 19, name: "Commander Shepard", email: "shepard@alliance.mil", company: "Systems Alliance", plan: "Business", mrr: 1899, status: "Trial", created: "Jul 15, 2025", lastSeen: "Yesterday 22:33" }
  ];

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
          <Breadcrumbs currentTicket={id}/>
          {/* <h1 className="text-xl font-semibold">{customer.name}</h1> */}
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
                      <Td className="whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Link href={`/dashboard/tickets/${t.id}`} className="text-[#249F73]">#{t.id}</Link>
                        </div>
                      </Td>
                      <Td className="max-w-[20rem] truncate">{t.title}</Td>
                      <Td className="hidden md:table-cell"><SeverityBadge severity={t.severity} /></Td>
                      <Td className="hidden md:table-cell"><PriorityBadge priority={t.priority} /></Td>
                      <Td><StatusBadge status={t.status} /></Td>
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