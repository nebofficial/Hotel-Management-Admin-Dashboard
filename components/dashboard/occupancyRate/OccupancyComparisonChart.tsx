"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Comparison = {
  current: any | null;
  previous: any | null;
};

type Props = {
  comparison: Comparison | null;
};

export function OccupancyComparisonChart({ comparison }: Props) {
  const current = comparison?.current;
  const previous = comparison?.previous;

  const data =
    current && previous
      ? [
          {
            label: "Previous",
            occupancy: previous.averageOccupancyRate ?? 0,
          },
          {
            label: "Current",
            occupancy: current.averageOccupancyRate ?? 0,
          },
        ]
      : [];

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/25 via-amber-400/20 to-rose-400/25 backdrop-blur">
      <div className="p-4 border-b border-orange-500/50">
        <p className="text-sm font-semibold text-orange-950">
          Occupancy Comparison
        </p>
        <p className="text-[11px] text-orange-900/85">
          Compare current period occupancy with the previous one.
        </p>
      </div>
      <div className="p-3 pt-2 h-40">
        {data.length === 0 ? (
          <p className="text-[11px] text-orange-950/80">
            Not enough data to build a comparison yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" opacity={0.4} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={34} unit="%" />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="occupancy" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

