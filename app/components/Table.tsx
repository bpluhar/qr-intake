import Link from "next/link";
import React from "react";


export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wide ${className}`}>{children}</th>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-sm ${className}`}>{children}</td>;
}

export function TableActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
        Filters
      </Link>
      <Link href="#" className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
        Columns
      </Link>
    </div>
  );
}

export function TableTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium text-slate-300">{children}</h2>
  );
}