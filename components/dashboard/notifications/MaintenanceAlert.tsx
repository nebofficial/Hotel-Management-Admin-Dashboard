"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  alerts: NotificationItem[];
};

export function MaintenanceAlert({ alerts }: Props) {
  const alert = alerts[0];
  const count = alert?.meta?.count ?? alerts.length;
  const rooms = alert?.meta?.rooms || [];

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/25 via-amber-400/20 to-red-400/25 backdrop-blur">
      <div className="p-4 border-b border-orange-400/70">
        <p className="text-sm font-semibold text-orange-950">
          Maintenance Alerts
        </p>
        <p className="text-[11px] text-orange-900/85">
          Rooms and equipment with open maintenance issues.
        </p>
      </div>
      <div className="p-3 text-xs text-orange-950 space-y-1.5">
        {alert ? (
          <>
            <p className="font-semibold">
              {count} maintenance ticket(s) currently open.
            </p>
            {rooms.length > 0 && (
              <p className="text-orange-900/80">
                Affected rooms: {rooms.join(", ")}
              </p>
            )}
          </>
        ) : (
          <p className="text-orange-900/80">
            No active maintenance alerts. All systems look good.
          </p>
        )}
      </div>
    </Card>
  );
}

