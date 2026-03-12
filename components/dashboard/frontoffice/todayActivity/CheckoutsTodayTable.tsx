"use client";

import { Card } from "@/components/ui/card";
import type { TodayActivityItem } from "./TodayActivityDashboard";
import { GuestReservationCard } from "./GuestReservationCard";
import { CheckoutStatusBadge } from "./CheckoutStatusBadge";
import { QuickCheckoutButton } from "./QuickCheckoutButton";

type Props = {
  items: TodayActivityItem[];
  mutatingId: string | null;
  onQuickCheckout: (id: string) => void | Promise<void>;
};

export function CheckoutsTodayTable({ items, mutatingId, onQuickCheckout }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-indigo-500/25 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-950">
          Today&apos;s Check-outs
        </p>
        <p className="text-[11px] text-sky-900/85">
          Guests departing today with quick check-out actions.
        </p>
      </div>
      <div className="p-3 space-y-2 max-h-[420px] overflow-auto">
        {items.length === 0 && (
          <p className="text-[11px] text-sky-950/80">
            No check-outs scheduled for today.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-md bg-white/80 border border-sky-500/30 px-2.5 py-2"
          >
            <GuestReservationCard item={item} />
            <div className="flex flex-col items-end gap-1">
              <CheckoutStatusBadge status={item.status} />
              <QuickCheckoutButton
                disabled={mutatingId === item.id || item.status === "checked_out"}
                onClick={() => {
                  void onQuickCheckout(item.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

