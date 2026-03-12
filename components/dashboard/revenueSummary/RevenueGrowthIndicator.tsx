"use client";

import { Card } from "@/components/ui/card";

type Row = { date: string; total: number };

type Props = {
  trend: Row[];
};

export function RevenueGrowthIndicator({ trend }: Props) {
  const data = trend || [];
  if (data.length < 2) {
    return (
      <Card className="border-0 bg-gradient-to-br from-teal-500/20 via-cyan-400/20 to-emerald-400/20 backdrop-blur">
        <div className="p-4">
          <p className="text-sm font-semibold text-teal-950">
            Revenue Growth Trends
          </p>
          <p className="text-[11px] text-teal-900/85">
            More data is required to calculate growth trends.
          </p>
        </div>
      </Card>
    );
  }

  const current = data[data.length - 1].total;
  const previous = data[data.length - 2].total;
  const diff = previous ? ((current - previous) / previous) * 100 : null;
  const positive = diff === null || diff >= 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-teal-500/20 via-cyan-400/20 to-emerald-400/20 backdrop-blur">
      <div className="p-4 space-y-2">
        <p className="text-sm font-semibold text-teal-950">
          Revenue Growth Trends
        </p>
        <div className="flex items-end justify-between gap-3 text-[11px]">
          <div>
            <p className="text-teal-900/85">Latest Day</p>
            <p className="text-lg font-bold text-teal-950">
              {current.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          {diff !== null && (
            <div className="text-right">
              <p
                className={`text-[13px] font-bold ${
                  positive ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {positive ? "▲" : "▼"} {diff > 0 ? "+" : ""}
                {diff.toFixed(1)}%
              </p>
              <p className="text-[10px] text-teal-900/80">
                vs previous day
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

