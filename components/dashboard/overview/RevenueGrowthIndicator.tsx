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

export function RevenueGrowthIndicator({ revenue }: Props) {
  const total = revenue?.total ?? 0;
  const previous = revenue?.previous ?? 0;
  const growth = revenue?.growthPct ?? null;
  const positive = growth === null || growth >= 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-amber-400/25 via-yellow-300/20 to-orange-300/25 backdrop-blur">
      <div className="p-4 space-y-2 text-xs text-amber-950">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide">
              Revenue Growth
            </p>
            <p className="text-[11px] text-amber-900/80">
              Current period vs previous period
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {growth !== null && (
              <>
                {positive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                )}
                <span
                  className={`text-sm font-bold ${
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
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <p className="text-[11px] text-amber-900/80">Current revenue</p>
            <p className="text-base font-semibold">
              ₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-amber-900/80">Previous period</p>
            <p className="text-base font-semibold">
              ₹{previous.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

