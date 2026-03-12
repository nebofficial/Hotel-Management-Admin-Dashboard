"use client";

import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Row = { date: string; total: number };

type Props = {
  trend: Row[];
};

export function RevenueVisualizationChart({ trend }: Props) {
  const data = trend || [];

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/15 via-emerald-400/15 to-violet-400/20 backdrop-blur">
      <div className="p-4 border-b border-sky-400/40">
        <p className="text-sm font-semibold text-slate-900">
          Revenue Analytics
        </p>
        <p className="text-[11px] text-slate-700">
          Combined view of daily revenue trend across departments.
        </p>
      </div>
      <div className="p-3 pt-2 h-52">
        {data.length === 0 ? (
          <p className="text-[11px] text-slate-800">
            No revenue trend data available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#revArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

