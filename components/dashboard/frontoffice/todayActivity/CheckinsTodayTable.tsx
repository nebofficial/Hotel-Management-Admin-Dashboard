"use client";

import { Card } from "@/components/ui/card";
import type { TodayActivityItem } from "./TodayActivityDashboard";
import { GuestReservationCard } from "./GuestReservationCard";
import { CheckinStatusBadge } from "./CheckinStatusBadge";
import { QuickCheckinButton } from "./QuickCheckinButton";

type Props = {
  items: TodayActivityItem[];
  mutatingId: string | null;
  onQuickCheckin: (id: string) => void | Promise<void>;
};

export function CheckinsTodayTable({ items, mutatingId, onQuickCheckin }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-teal-400/25 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-950">
          Today&apos;s Check-ins
        </p>
        <p className="text-[11px] text-emerald-900/85">
          Guests scheduled to arrive today with quick check-in actions.
        </p>
      </div>
      <div className="p-3 space-y-2 max-h-[420px] overflow-auto">
        {items.length === 0 && (
          <p className="text-[11px] text-emerald-950/80">
            No check-ins scheduled for today.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-md bg-white/80 border border-emerald-500/30 px-2.5 py-2"
          >
            <GuestReservationCard item={item} />
            <div className="flex flex-col items-end gap-1">
              <CheckinStatusBadge status={item.status} />
              <QuickCheckinButton
                disabled={mutatingId === item.id || item.status === "checked_in"}
                onClick={() => {
                  void onQuickCheckin(item.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

