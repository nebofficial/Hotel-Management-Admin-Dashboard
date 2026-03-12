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

type Row = {
  roomType: string;
  occupancyPercentage: number;
};

type Props = {
  items: Row[];
};

export function RoomTypeOccupancyChart({ items }: Props) {
  const data = (items || []).map((r) => ({
    roomType: r.roomType,
    occupancy: r.occupancyPercentage ?? 0,
  }));

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/25 via-amber-300/20 to-orange-300/25 backdrop-blur">
      <div className="p-4 border-b border-amber-400/60">
        <p className="text-sm font-semibold text-amber-950">
          Room Type Occupancy Breakdown
        </p>
        <p className="text-[11px] text-amber-900/85">
          Compare how different room categories are performing.
        </p>
      </div>
      <div className="p-3 pt-2 h-52">
        {data.length === 0 ? (
          <p className="text-[11px] text-amber-950/80">
            No room type occupancy data available for the selected period.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#facc15" opacity={0.25} />
              <XAxis dataKey="roomType" tick={{ fontSize: 11 }} />
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

