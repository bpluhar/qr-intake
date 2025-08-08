// app/dashboard/layout.tsx
// Dynamic SSR Layout: fetch user via Convex and render sidebar with initial email.
// Note: Making the layout dynamic means child routes fetch a fresh RSC payload on navigation.

// export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import SidebarClient from "./SidebarClient"; // client component (see file next to this one)
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// Type guard for Convex current user shape
type CurrentUser = { email?: string | null };
function isCurrentUser(x: unknown): x is CurrentUser {
  return typeof x === "object" && x !== null && "email" in x;
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let initialEmail: string | null = null;
  try {
    const token = await convexAuthNextjsToken();
    const result: unknown = token
      ? await fetchQuery(api.functions.users.getCurrent, {}, { token })
      : null;
    if (isCurrentUser(result)) {
      initialEmail = result.email ?? null;
    }
  } catch {
    // Auth is enforced by middleware; ignore errors here
  }

  return (
    <div className="min-h-dvh md:h-screen bg-[#0b1217] text-slate-200 overflow-hidden md:grid md:grid-cols-[16rem_1fr]">
      {/* Left column: Sidebar (fixed column). On mobile this just renders the hamburger; on desktop it's the full sidebar. */}
      <div className="md:h-screen md:overflow-hidden">
        <SidebarClient initialEmail={initialEmail} />
      </div>

      {/* Right column: content (the only scroll area on desktop) */}
      <div className="w-full min-w-0 md:h-screen md:overflow-y-auto">{children}</div>
    </div>
  );
}