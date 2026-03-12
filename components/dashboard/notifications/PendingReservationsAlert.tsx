"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  all: NotificationItem[];
};

export function PendingReservationsAlert({ all }: Props) {
  const pending = all.find((n) => n.type === "PENDING_RESERVATIONS");
  const count = pending?.meta?.count ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/25 via-amber-300/20 to-orange-200/25 backdrop-blur">
      <div className="p-4 border-b border-amber-400/60">
        <p className="text-sm font-semibold text-amber-950">
          Pending Reservations
        </p>
        <p className="text-[11px] text-amber-900/85">
          Reservations waiting for confirmation or nearing expiry.
        </p>
      </div>
      <div className="p-3 text-xs text-amber-950 space-y-1.5">
        {pending ? (
          <>
            <p className="font-semibold">{pending.message}</p>
            <p className="text-amber-900/80">
              Pending confirmations:{" "}
              <span className="font-semibold">{count}</span>
            </p>
          </>
        ) : (
          <p className="text-amber-900/80">
            No pending reservations requiring attention right now.
          </p>
        )}
      </div>
    </Card>
  );
}

