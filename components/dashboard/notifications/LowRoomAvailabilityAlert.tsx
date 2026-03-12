"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  alerts: NotificationItem[];
};

export function LowRoomAvailabilityAlert({ alerts }: Props) {
  const alert = alerts[0];

  return (
    <Card className="border-0 bg-gradient-to-br from-red-600/25 via-rose-500/20 to-orange-500/25 backdrop-blur">
      <div className="p-4 border-b border-red-500/60">
        <p className="text-sm font-semibold text-red-50">
          Low Room Availability
        </p>
        <p className="text-[11px] text-red-100/90">
          Warns when remaining rooms are below a safe threshold.
        </p>
      </div>
      <div className="p-3 text-xs text-red-50 space-y-1.5">
        {alert ? (
          <>
            <p className="font-semibold">{alert.message}</p>
            {alert.meta && (
              <p className="text-red-100/85">
                Remaining: {alert.meta.remainingRooms} • Occupied:{" "}
                {alert.meta.occupiedRooms} • Total: {alert.meta.totalRooms}
              </p>
            )}
          </>
        ) : (
          <p className="text-red-100/85">
            No low availability alerts at the moment. Room inventory is
            healthy.
          </p>
        )}
      </div>
    </Card>
  );
}

