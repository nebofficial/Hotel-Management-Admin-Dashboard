"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type RevenuePoint = { date: string; revenue: number };
type OccPoint = { date: string; occupancyRate: number };

type Props = {
  revenueTrend: RevenuePoint[];
  occupancyTrend: OccPoint[];
};

export function KPIAnalyticsCharts({ revenueTrend, occupancyTrend }: Props) {
  const revenueData = revenueTrend || [];
  const occData = occupancyTrend || [];

  return (
    <Card className="border-0 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-emerald-400/20 backdrop-blur">
      <div className="p-4 space-y-3 text-xs text-slate-950">
        <p className="text-[11px] font-semibold uppercase tracking-wide">
          KPI Analytics
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-40">
            <p className="text-[11px] mb-1 text-slate-800">Revenue trend</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 4, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  width={32}
                  tickFormatter={(v) =>
                    typeof v === "number"
                      ? `${(v / 1000).toFixed(0)}k`
                      : v
                  }
                />
                <Tooltip
                  contentStyle={{ fontSize: 11 }}
                  formatter={(v: any) =>
                    typeof v === "number"
                      ? `₹${v.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}`
                      : v
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-40">
            <p className="text-[11px] mb-1 text-slate-800">Occupancy trend</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={occData}
                margin={{ top: 4, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  width={28}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{ fontSize: 11 }}
                  formatter={(v: any) =>
                    typeof v === "number" ? `${v.toFixed(1)}%` : v
                  }
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="occupancyRate"
                  name="Occupancy %"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

