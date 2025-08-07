export type TicketRow = {
  id: number;
  customer_id: number;
  customer: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "P1" | "P2" | "P3" | "P4";
  status: "Open" | "Pending" | "Resolved";
  created: string;
  assignees: string[];
};

export const ticketRows: TicketRow[] = [
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