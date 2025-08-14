"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

export default function Breadcrumbs( { currentTicket }: { currentTicket?: Id<"tickets"> }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Helper to prettify each segment
  const labelFrom = (seg: string) =>
    seg.length > 0 ? seg.charAt(0).toUpperCase() + seg.slice(1) : seg;

  // Build cumulative hrefs so each link points upward one level
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;
    const label = isLast && Number.isFinite(currentTicket)
      ? String(currentTicket)
      : labelFrom(seg);
    return { label, href, idx };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-slate-400">
        <span className="text-xl mr-1">/</span>
        {crumbs.map(({ label, href, idx }) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={href} className="flex items-center gap-1">
              {isLast ? (
                <span className="text-[#249F73] text-xl font-semibold">{label}</span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-slate-100 text-xl transition-colors"
                >
                  {label}
                </Link>
              )}
              {!isLast && <span className="text-xl mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}