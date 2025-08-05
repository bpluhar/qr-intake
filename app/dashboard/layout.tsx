// app/dashboard/layout.tsx
// Dynamic SSR Layout: fetch user via Convex and render sidebar with initial email.
// Note: Making the layout dynamic means child routes fetch a fresh RSC payload on navigation.

export const dynamic = "force-dynamic";

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
      ? await fetchQuery(api.users.getCurrent, {}, { token })
      : null;
    if (isCurrentUser(result)) {
      initialEmail = result.email ?? null;
    }
  } catch {
    // Auth is enforced by middleware; ignore errors here
  }

  return (
    <div className="min-h-dvh md:min-h-screen bg-[#0b1217] text-slate-200 flex overflow-x-hidden">
      {/* Client sidebar reads pathname, handles sign out, and shows the SSR-provided email */}
      <SidebarClient initialEmail={initialEmail} />
      <div className="flex-1 w-full min-w-0">{children}</div>
    </div>
  );
}