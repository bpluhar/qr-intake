import React from "react";

export function StatusBadge(
  { status }: { status: "Open" | "Pending" | "Resolved" | string },
) {
  const map: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
    Pending: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
    Resolved: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${
        map[status] ?? "bg-slate-700/40 text-slate-300 ring-1 ring-slate-600/40"
      }`}
    >
      {status}
    </span>
  );
}
