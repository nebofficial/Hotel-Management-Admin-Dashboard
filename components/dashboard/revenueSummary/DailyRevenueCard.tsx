"use client";

import { Card } from "@/components/ui/card";

type Props = {
  daily: {
    totalToday?: number;
    currency?: string;
    byDate?: { date: string; total: number }[];
  } | null;
};

export function DailyRevenueCard({ daily }: Props) {
  const total = daily?.totalToday ?? 0;
  const currency = daily?.currency || "INR";

  const yesterdayRow =
    daily?.byDate && daily.byDate.length > 1
      ? daily.byDate[daily.byDate.length - 2]
      : null;
  const yesterday = yesterdayRow?.total ?? 0;
  const diff = yesterday ? ((total - yesterday) / yesterday) * 100 : null;

  const positive = diff === null || diff >= 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-lime-400/25 backdrop-blur">
      <div className="p-4 space-y-1.5">
        <p className="text-[11px] font-semibold text-emerald-950/90">
          Daily Revenue
        </p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-emerald-950">
              {currency} {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-emerald-900/80">
              Total revenue generated today
            </p>
          </div>
          {diff !== null && (
            <div className="text-right">
              <p
                className={`text-[11px] font-semibold ${
                  positive ? "text-emerald-800" : "text-rose-600"
                }`}
              >
                {positive ? "▲" : "▼"} {diff > 0 ? "+" : ""}
                {diff.toFixed(1)}%
              </p>
              <p className="text-[10px] text-emerald-900/70">
                vs previous day
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

