"use client";

import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sampleData = [
  { name: "Mon", api: 1200, load: 30, db: 60 },
  { name: "Tue", api: 1800, load: 45, db: 62 },
  { name: "Wed", api: 1500, load: 35, db: 63 },
  { name: "Thu", api: 2100, load: 55, db: 65 },
  { name: "Fri", api: 2300, load: 60, db: 66 },
  { name: "Sat", api: 1700, load: 40, db: 67 },
  { name: "Sun", api: 1400, load: 32, db: 68 },
];

export function SystemPerformanceCharts() {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-lg shadow-sky-500/20">
      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">System Performance</p>
          <p className="text-xs text-slate-400">
            Visual overview of API usage, system load and database growth.
          </p>
        </div>
      </div>
      <div className="h-72 px-2 pb-3 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData}>
            <defs>
              <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorDb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderColor: "#1e293b",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="api"
              name="API calls"
              stroke="#38bdf8"
              fillOpacity={1}
              fill="url(#colorApi)"
            />
            <Area
              type="monotone"
              dataKey="load"
              name="System load"
              stroke="#a855f7"
              fillOpacity={1}
              fill="url(#colorLoad)"
            />
            <Area
              type="monotone"
              dataKey="db"
              name="DB size index"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorDb)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

