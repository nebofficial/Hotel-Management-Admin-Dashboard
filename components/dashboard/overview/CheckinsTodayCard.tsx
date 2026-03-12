"use client";

import { Card } from "@/components/ui/card";

type Props = {
  data: {
    count?: number;
  } | null;
};

export function CheckinsTodayCard({ data }: Props) {
  const count = data?.count ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-violet-500/20 backdrop-blur">
      <div className="p-3.5 space-y-1.5">
        <p className="text-[11px] font-semibold text-purple-50">
          Check-ins Today
        </p>
        <p className="text-xl font-bold text-white">{count}</p>
        <p className="text-[11px] text-purple-100/90">
          Guests scheduled to arrive and already checked in.
        </p>
      </div>
    </Card>
  );
}

