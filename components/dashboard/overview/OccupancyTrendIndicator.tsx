"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Point = { date: string; occupancyRate: number };

type Props = {
  trend: Point[];
};

export function OccupancyTrendIndicator({ trend }: Props) {
  const data = trend || [];

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-400/25 via-amber-300/20 to-rose-300/25 backdrop-blur">
      <div className="p-4 space-y-2 text-xs text-orange-950">
        <p className="text-[11px] font-semibold uppercase tracking-wide">
          Occupancy Trend
        </p>
        <p className="text-[11px] text-orange-900/80">
          Daily occupancy rate over the selected period.
        </p>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                width={26}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(v: any) => `${v.toFixed ? v.toFixed(1) : v}%`}
              />
              <Line
                type="monotone"
                dataKey="occupancyRate"
                stroke="#ea580c"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

