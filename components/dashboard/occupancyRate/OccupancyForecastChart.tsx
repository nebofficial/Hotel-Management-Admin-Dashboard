"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Row = {
  label: string;
  expectedOccupancyRate: number;
};

type Props = {
  forecast: Row[];
};

export function OccupancyForecastChart({ forecast }: Props) {
  const data = forecast || [];

  return (
    <Card className="border-0 bg-gradient-to-br from-indigo-500/25 via-violet-500/20 to-sky-500/25 backdrop-blur">
      <div className="p-4 border-b border-indigo-500/50">
        <p className="text-sm font-semibold text-indigo-50">
          Occupancy Forecast
        </p>
        <p className="text-[11px] text-indigo-100/90">
          Simple forward-looking occupancy prediction based on recent weeks.
        </p>
      </div>
      <div className="p-3 pt-2 h-40 text-indigo-50">
        {data.length === 0 ? (
          <p className="text-[11px] text-indigo-100/90">
            Forecast will appear once there is enough historical data.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a5b4fc" opacity={0.35} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#e0e7ff" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#e0e7ff" }}
                width={34}
                unit="%"
              />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="expectedOccupancyRate"
                stroke="#e0e7ff"
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

