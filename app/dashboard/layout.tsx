export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import SidebarClient from "./SidebarClient"; // client component (see file next to this one)

export default async function DashboardLayout(
  { children }: { children: ReactNode },
) {
  return (
    <div className="min-h-dvh md:h-screen bg-[#0b1217] text-slate-200 overflow-hidden md:grid md:grid-cols-[16rem_1fr]">
      <div className="md:h-screen md:overflow-hidden">
        <SidebarClient />
      </div>
      <div className="w-full min-w-0 md:h-screen md:overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
