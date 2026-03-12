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
  current: { date: string; total: number } | null;
  previous: { date: string; total: number } | null;
};

type Props = {
  comparison: Comparison | null;
};

export function RevenueComparisonChart({ comparison }: Props) {
  const current = comparison?.current;
  const previous = comparison?.previous;

  const data =
    current && previous
      ? [
          { label: "Previous", total: previous.total },
          { label: "Current", total: current.total },
        ]
      : [];

  return (
    <Card className="border-0 bg-gradient-to-br from-pink-500/25 via-rose-400/20 to-fuchsia-400/25 backdrop-blur">
      <div className="p-4 border-b border-pink-500/50">
        <p className="text-sm font-semibold text-pink-950">
          Revenue Comparison
        </p>
        <p className="text-[11px] text-pink-900/85">
          Compare current period revenue with the previous one.
        </p>
      </div>
      <div className="p-3 pt-2 h-40">
        {data.length === 0 ? (
          <p className="text-[11px] text-pink-950/80">
            Not enough revenue trend data to build a comparison.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" opacity={0.4} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="total" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

