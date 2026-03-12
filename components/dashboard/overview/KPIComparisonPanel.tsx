"use client";

import { Card } from "@/components/ui/card";

type Props = {
  revenue: { total?: number; previous?: number } | null;
  occupancy: { rate?: number } | null;
};

export function KPIComparisonPanel({ revenue, occupancy }: Props) {
  const total = revenue?.total ?? 0;
  const previous = revenue?.previous ?? 0;
  const revenueDiff = total - previous;

  const occRate = occupancy?.rate ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-pink-400/25 via-rose-300/20 to-fuchsia-300/25 backdrop-blur">
      <div className="p-4 space-y-2 text-xs text-rose-950">
        <p className="text-[11px] font-semibold uppercase tracking-wide">
          Performance Comparison
        </p>
        <p className="text-[11px] text-rose-900/85">
          Compare revenue and occupancy against the previous period.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-1.5">
          <div>
            <p className="text-[11px] text-rose-900/80">Revenue difference</p>
            <p
              className={`text-base font-semibold ${
                revenueDiff >= 0 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {revenueDiff >= 0 ? "+" : "-"}₹
              {Math.abs(revenueDiff).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-rose-900/80">Current occupancy</p>
            <p className="text-base font-semibold">
              {occRate.toFixed(1)}% occupied
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

