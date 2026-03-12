"use client";

import { Card } from "@/components/ui/card";

type MonthlyRow = {
  month: string;
  monthLabel: string;
  occupancyPercentage: number;
};

type Props = {
  monthly: MonthlyRow[];
};

export function MonthlyOccupancyStats({ monthly }: Props) {
  if (!monthly || monthly.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-pink-500/25 backdrop-blur">
        <div className="p-4">
          <p className="text-sm font-semibold text-purple-950">
            Monthly Occupancy Statistics
          </p>
          <p className="text-[11px] text-purple-950/80">
            Not enough data to calculate monthly statistics yet.
          </p>
        </div>
      </Card>
    );
  }

  const avg =
    monthly.reduce((sum, m) => sum + (m.occupancyPercentage || 0), 0) /
    monthly.length;
  const highest = [...monthly].sort(
    (a, b) => (b.occupancyPercentage || 0) - (a.occupancyPercentage || 0)
  )[0];
  const lowest = [...monthly].sort(
    (a, b) => (a.occupancyPercentage || 0) - (b.occupancyPercentage || 0)
  )[0];

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-pink-500/25 backdrop-blur">
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-purple-950">
          Monthly Occupancy Statistics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="rounded-md bg-white/80 border border-purple-400/40 px-3 py-2">
            <p className="font-medium text-purple-950/90">Average Occupancy</p>
            <p className="mt-1 text-lg font-bold text-purple-950">
              {avg.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-md bg-white/80 border border-emerald-400/50 px-3 py-2">
            <p className="font-medium text-emerald-900/90">Highest Month</p>
            <p className="mt-0.5 font-semibold text-emerald-950">
              {highest.monthLabel}
            </p>
            <p className="text-[11px] text-emerald-900/80">
              {highest.occupancyPercentage.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-md bg-white/80 border border-amber-400/60 px-3 py-2">
            <p className="font-medium text-amber-900/90">Lowest Month</p>
            <p className="mt-0.5 font-semibold text-amber-950">
              {lowest.monthLabel}
            </p>
            <p className="text-[11px] text-amber-900/80">
              {lowest.occupancyPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

