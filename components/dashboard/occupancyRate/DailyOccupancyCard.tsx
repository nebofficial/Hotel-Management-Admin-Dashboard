"use client";

import { Card } from "@/components/ui/card";

type Props = {
  summary: {
    totalRooms?: number;
    roomsOccupiedToday?: number;
    roomsAvailableToday?: number;
    occupancyRateToday?: number;
    date?: string;
  } | null;
};

export function DailyOccupancyCard({ summary }: Props) {
  const total = summary?.totalRooms ?? 0;
  const occupied = summary?.roomsOccupiedToday ?? 0;
  const available = summary?.roomsAvailableToday ?? 0;
  const rate = summary?.occupancyRateToday ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-lime-400/25 backdrop-blur">
      <div className="p-4 space-y-1.5">
        <p className="text-[11px] font-semibold text-emerald-950/90">
          Today&apos;s Occupancy
        </p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-emerald-950">
              {rate.toFixed(1)}%
            </p>
            <p className="text-[11px] text-emerald-900/80">
              {occupied} of {total} rooms occupied
            </p>
          </div>
          <div className="flex-1 max-w-[140px]">
            <div className="h-2 rounded-full bg-emerald-100/70 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400"
                style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-emerald-900/80">
              Date: {summary?.date || new Date().toISOString().slice(0, 10)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

