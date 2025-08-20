// app/dashboard/layout.tsx
// Dynamic SSR Layout: fetch user via Convex and render sidebar with initial email.
// Note: Making the layout dynamic means child routes fetch a fresh RSC payload on navigation.

// export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import SidebarClient from "./SidebarClient"; // client component (see file next to this one)

export default async function DashboardLayout(
  { children }: { children: ReactNode },
) {
  return (
    <div className="min-h-dvh md:h-screen bg-[#0b1217] text-slate-200 overflow-hidden md:grid md:grid-cols-[16rem_1fr]">
      {/* Left column: Sidebar (fixed column). On mobile this just renders the hamburger; on desktop it's the full sidebar. */}
      <div className="md:h-screen md:overflow-hidden">
        <SidebarClient />
      </div>

      {/* Right column: content (the only scroll area on desktop) */}
      <div className="w-full min-w-0 md:h-screen md:overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
