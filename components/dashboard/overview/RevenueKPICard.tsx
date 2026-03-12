"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  revenue: {
    total?: number;
    previous?: number;
    growthPct?: number | null;
  } | null;
};

export function RevenueKPICard({ revenue }: Props) {
  const total = revenue?.total ?? 0;
  const growth = revenue?.growthPct ?? null;
  const positive = growth === null || growth >= 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-lime-400/25 backdrop-blur">
      <div className="p-3.5 space-y-1.5">
        <p className="text-[11px] font-semibold text-emerald-950/90">
          Total Revenue
        </p>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-bold text-emerald-950">
              ₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-emerald-900/80">
              For selected period
            </p>
          </div>
          <div className="flex items-center gap-1">
            {growth !== null && (
              <>
                {positive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span
                  className={`text-[11px] font-semibold ${
                    positive ? "text-emerald-800" : "text-rose-600"
                  }`}
                >
                  {growth > 0 ? "+" : ""}
                  {growth.toFixed(1)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

