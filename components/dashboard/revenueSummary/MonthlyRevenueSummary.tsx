"use client";

import { Card } from "@/components/ui/card";

type Row = { date: string; total: number };

type Props = {
  byDate: Row[];
};

export function MonthlyRevenueSummary({ byDate }: Props) {
  const data = byDate || [];
  if (!data.length) {
    return (
      <Card className="border-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-pink-500/25 backdrop-blur">
        <div className="p-4">
          <p className="text-sm font-semibold text-purple-950">
            Monthly Revenue Summary
          </p>
          <p className="text-[11px] text-purple-950/80">
            No revenue data available for the selected period.
          </p>
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, r) => sum + (r.total || 0), 0);
  const avg = total / data.length;
  const highest = [...data].sort((a, b) => b.total - a.total)[0];

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-pink-500/25 backdrop-blur">
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-purple-950">
          Monthly Revenue Summary
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="rounded-md bg-white/80 border border-purple-400/40 px-3 py-2">
            <p className="font-medium text-purple-950/90">
              Total Revenue (period)
            </p>
            <p className="mt-1 text-lg font-bold text-purple-950">
              {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-md bg-white/80 border border-emerald-400/50 px-3 py-2">
            <p className="font-medium text-emerald-900/90">
              Average Daily Revenue
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-950">
              {avg.toFixed(0)}
            </p>
          </div>
          <div className="rounded-md bg-white/80 border border-amber-400/60 px-3 py-2">
            <p className="font-medium text-amber-900/90">Highest Day</p>
            <p className="mt-0.5 font-semibold text-amber-950">
              {highest.date}
            </p>
            <p className="text-[11px] text-amber-900/80">
              {highest.total.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

