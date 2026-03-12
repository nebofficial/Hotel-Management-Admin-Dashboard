"use client";

import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Summary = {
  totalRooms?: number;
  roomsOccupiedToday?: number;
  roomsAvailableToday?: number;
};

type Props = {
  summary: Summary | null;
};

const COLORS = ["#0ea5e9", "#22c55e"];

export function AvailableVsOccupiedChart({ summary }: Props) {
  const occupied = summary?.roomsOccupiedToday ?? 0;
  const available = summary?.roomsAvailableToday ?? 0;

  const data =
    occupied + available === 0
      ? []
      : [
          { name: "Occupied", value: occupied },
          { name: "Available", value: available },
        ];

  return (
    <Card className="border-0 bg-gradient-to-br from-teal-500/25 via-cyan-400/20 to-emerald-400/25 backdrop-blur">
      <div className="p-4 border-b border-teal-500/50">
        <p className="text-sm font-semibold text-teal-950">
          Available vs Occupied Rooms
        </p>
        <p className="text-[11px] text-teal-900/85">
          Visual split between occupied and available rooms.
        </p>
      </div>
      <div className="p-3 pt-2 h-40">
        {data.length === 0 ? (
          <p className="text-[11px] text-teal-950/80">
            No occupancy data available for today.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={54}
                innerRadius={30}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

