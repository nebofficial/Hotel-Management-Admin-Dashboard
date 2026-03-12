"use client";

import { Card } from "@/components/ui/card";

type Props = {
  data: {
    totalAvailable?: number;
    booked?: number;
    maintenance?: number;
  } | null;
};

export function AvailableRoomsCard({ data }: Props) {
  const available = data?.totalAvailable ?? 0;
  const booked = data?.booked ?? 0;
  const maintenance = data?.maintenance ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-emerald-500/20 backdrop-blur">
      <div className="p-3.5 space-y-1.5">
        <p className="text-[11px] font-semibold text-teal-950/90">
          Available Rooms
        </p>
        <p className="text-xl font-bold text-teal-950">{available}</p>
        <p className="text-[11px] text-teal-900/85">
          {booked} booked · {maintenance} under maintenance
        </p>
      </div>
    </Card>
  );
}

