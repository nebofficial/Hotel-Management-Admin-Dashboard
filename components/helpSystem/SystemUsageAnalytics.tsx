"use client";

import { Card } from "@/components/ui/card";

type DailyUsage = {
  date: string;
  activeUsers: number;
  apiRequests: number;
};

type FeatureUsage = {
  feature: string;
  value: number;
};

type Props = {
  dailyUsage: DailyUsage[];
  featureUsage: FeatureUsage[];
};

export function SystemUsageAnalytics({ dailyUsage, featureUsage }: Props) {
  const maxUsers = dailyUsage.reduce(
    (max, d) => (d.activeUsers > max ? d.activeUsers : max),
    1,
  );

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">System Usage Analytics</p>
        <p className="text-[11px] text-slate-300">
          Daily usage, active users, and feature adoption.
        </p>
      </div>
      <div className="p-4 space-y-4 text-[11px]">
        <div>
          <p className="mb-2 font-semibold text-slate-200">Daily Active Users</p>
          <div className="flex items-end gap-2">
            {dailyUsage.map((d) => {
              const h = (d.activeUsers / maxUsers) * 56;
              return (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 rounded-t-md bg-sky-500"
                    style={{ height: `${Math.max(h, 4)}px` }}
                  />
                  <span className="text-[10px] text-slate-300">
                    {new Date(d.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold text-slate-200">
            Feature Usage Share
          </p>
          <div className="space-y-1.5">
            {featureUsage.map((f) => (
              <div key={f.feature}>
                <div className="flex justify-between mb-0.5">
                  <span>{f.feature}</span>
                  <span>{f.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${Math.min(f.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

