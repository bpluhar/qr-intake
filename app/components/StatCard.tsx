import React from "react";
import { Card } from "@/app/components/Card";

export function StatCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
        </div>
        <span
          className={`mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs ${
            positive
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
              : "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30"
          }`}
        >
          {delta}
        </span>
      </div>
    </Card>
  );
}


