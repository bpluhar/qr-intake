// app/dashboard/layout.tsx
// Server Layout: fetches initialEmail via Convex SSR and renders a sidebar + page content

export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import SidebarClient from "./SidebarClient"; // client component (see file next to this one)

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let initialEmail: string | null = null;
  try {
    const token = await convexAuthNextjsToken();
    const user = token ? await fetchQuery(api.users.getCurrent, {}, { token }) : null;
    initialEmail = (user as any)?.email ?? null;
  } catch {}

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      {/* Client sidebar reads pathname, handles sign out, and shows the SSR email */}
      <SidebarClient initialEmail={initialEmail} />
      <div className="flex-1">{children}</div>
    </div>
  );
}