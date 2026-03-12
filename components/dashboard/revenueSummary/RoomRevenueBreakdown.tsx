"use client";

import { Card } from "@/components/ui/card";

type Props = {
  room: {
    totalRoomRevenue?: number;
    adr?: number;
    revpar?: number;
    totalBookings?: number;
  } | null;
};

export function RoomRevenueBreakdown({ room }: Props) {
  const total = room?.totalRoomRevenue ?? 0;
  const adr = room?.adr ?? 0;
  const revpar = room?.revpar ?? 0;
  const bookings = room?.totalBookings ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/25 via-amber-300/20 to-orange-300/25 backdrop-blur">
      <div className="p-4 space-y-2">
        <p className="text-sm font-semibold text-amber-950">
          Revenue by Room Bookings
        </p>
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-md bg-white/80 border border-amber-400/60 px-3 py-2">
            <p className="font-medium text-amber-900/90">Room Revenue</p>
            <p className="mt-1 text-lg font-bold text-amber-950">
              {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-md bg-white/80 border border-amber-400/60 px-3 py-2">
            <p className="font-medium text-amber-900/90">
              ADR / RevPAR
            </p>
            <p className="mt-1 text-lg font-bold text-amber-950">
              {adr.toFixed(0)} / {revpar.toFixed(0)}
            </p>
            <p className="text-[10px] text-amber-900/80">
              Avg daily rate & revenue per available room
            </p>
          </div>
          <div className="rounded-md bg-white/80 border border-amber-400/60 px-3 py-2 col-span-2">
            <p className="font-medium text-amber-900/90">
              Total Bookings
            </p>
            <p className="mt-1 text-lg font-bold text-amber-950">
              {bookings}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

