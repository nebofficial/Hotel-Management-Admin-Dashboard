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

type WeeklyRow = {
  weekStart: string;
  weekEnd: string;
  averageOccupancyRate: number;
};

type Props = {
  weekly: WeeklyRow[];
};

export function WeeklyOccupancyTrendChart({ weekly }: Props) {
  const data = (weekly || []).map((w) => ({
    label: `${w.weekStart.slice(5)}–${w.weekEnd.slice(5)}`,
    occupancy: w.averageOccupancyRate ?? 0,
  }));

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-indigo-500/25 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-950">
          Weekly Occupancy Trends
        </p>
        <p className="text-[11px] text-sky-900/85">
          Day-by-day occupancy summarized into weekly averages.
        </p>
      </div>
      <div className="p-3 pt-2 h-56">
        {data.length === 0 ? (
          <p className="text-[11px] text-sky-950/80">
            Not enough data to display weekly trends.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={32} unit="%" />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

