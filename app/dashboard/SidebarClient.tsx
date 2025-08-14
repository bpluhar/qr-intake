// app/dashboard/SidebarClient.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// same isActivePath helper you’re using now
function isActivePath(pathname: string, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  // For the section root (/dashboard), only highlight on exact match
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  // For sub-routes, allow exact match or nested paths
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SidebarClient() {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  // Fetch current user using useQuery
  const user = useQuery(api.functions.users.getCurrent, {});
  let userProfile: { email?: string; fullName?: string } | null = null;
  const userHasId = user && user._id;
  // If user exists and has _id, fetch the profile
  const profile = useQuery(
    api.functions.profiles.getProfileByUserId,
    userHasId ? { userId: user._id } : "skip"
  );

  if (profile) {
    userProfile = {
      email: user?.email ?? undefined,
      fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    };
  } else if (user) {
    // Fallback to just email if no profile
    userProfile = { email: user.email ?? undefined };
  }

  // Avoid hydration mismatch: only compute "active" after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  useEffect(() => {
    ["/dashboard", "/dashboard/reports", "/dashboard/tickets", "/dashboard/customers", "/dashboard/settings"].forEach((p) => {
      router.prefetch(p);
    });
  });

  const fullName = userProfile?.fullName ?? "";
  const initial = initials(fullName);
  // Returns the initials (up to 2 characters) from a full name, or "U" if not available.
  function initials(fullName: string): string {
    if (!fullName || !fullName.trim()) return "U";
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
  // Take first letter of first and last part
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

  const nav = [
    { href: "/dashboard", label: "Overview", icon: IconHome },
    { href: "/dashboard/tickets", label: "Tickets", icon: IconTicket },
    { href: "/dashboard/customers", label: "Customers", icon: IconUsers },
    { href: "/dashboard/companies", label: "Companies", icon: IconTeams },
    { href: "/dashboard/reports", label: "Reports", icon: IconChart },
    { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
    { href: "/dashboard/testing", label: "Testing", icon: IconTesting },
  ];
  

  // Mobile sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden p-4 text-slate-300 w-fit"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile sidebar drawer with transition */}
      <div
        className={`fixed inset-0 z-50 flex transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
        style={{ pointerEvents: isMobileOpen ? "auto" : "none" }}
      >
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800/80 p-4 flex flex-col justify-between ">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold tracking-tight text-white">Triage</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-slate-300"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">
              {nav.map((item) => {
                const active = mounted && isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm border border-transparent hover:bg-slate-800/70 ${
                      active ? "bg-slate-800/70 border-slate-700 text-emerald-400" : "text-slate-300"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.icon className={`h-4 w-4 ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60">
                <span className="text-sm font-medium">{initial}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-200">{fullName}</p>
                {userProfile?.email && (
                  <p className="truncate text-xs text-slate-400">{userProfile.email}</p>
                )}
              </div>
              <button
                onClick={async () => {
                  setPending(true);
                  try {
                    await signOut();
                    if (typeof document !== "undefined") {
                      document.cookie = "triage_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
                      document.cookie = "triage_email=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
                    }
                  } finally {
                    setPending(false);
                  }
                }}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 ring-1 ring-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                {pending ? "Signing out…" : <IconSignout className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        {/* Backdrop overlay */}
        <div
          className={`flex-1 bg-black/40 transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileOpen(false)}
        />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:h-full md:w-64 md:flex-col md:justify-between border-r border-slate-800/80 bg-slate-900/60 backdrop-blur shrink-0 md:overflow-y-auto">
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
              const active = mounted && isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm border border-transparent hover:bg-slate-800/70 ${
                    active ? "bg-slate-800/70 border-slate-700 text-emerald-400" : "text-slate-300"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className={`h-4 w-4 ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300"}`} />
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
              <p className="truncate text-sm font-semibold text-slate-200">{fullName}</p>
              {userProfile?.email && (
                <p className="truncate text-xs text-slate-400">{userProfile.email}</p>
              )}
            </div>
            <button
              onClick={async () => {
                setPending(true);
                try {
                  await signOut();
                  // Clean up cookies
                  if (typeof document !== "undefined") {
                    document.cookie = "triage_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
                    document.cookie = "triage_email=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
                  }
                } finally {
                  setPending(false);
                }
              }}
              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 ring-1 ring-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            >
              <IconSignout className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}


function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  );
}




function IconTicket(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  );
}

function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

function IconTeams(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
      <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
    </svg>
  );
}



function IconChart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
    </svg>
  );
}

function IconSettings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
    </svg>
  );
}

function IconTesting(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>{/* size-4 fallback */}
      <path fillRule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  );
}

function IconSignout(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} className={["size-4", props.className].filter(Boolean).join(" ")}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
    </svg>
  );
}

