"use client";

import { Card } from "@/components/ui/card";

type Props = {
  occupancy: {
    rate?: number;
    totalRooms?: number;
    occupiedRooms?: number;
  } | null;
};

export function OccupancyRateCard({ occupancy }: Props) {
  const rate = occupancy?.rate ?? 0;
  const total = occupancy?.totalRooms ?? 0;
  const occupied = occupancy?.occupiedRooms ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-indigo-500/25 backdrop-blur">
      <div className="p-3.5 space-y-2">
        <p className="text-[11px] font-semibold text-sky-950/90">
          Occupancy Rate
        </p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-sky-950">
              {rate.toFixed(1)}%
            </p>
            <p className="text-[11px] text-sky-900/80">
              {occupied} of {total} rooms occupied
            </p>
          </div>
          <div className="flex-1 max-w-[120px]">
            <div className="h-2 rounded-full bg-sky-100/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"
                style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

