"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  all: NotificationItem[];
};

export function GuestRequestNotification({ all }: Props) {
  const guestAlerts = all.filter(
    (n) => n.type === "GUEST_REQUEST" || n.type === "ROOM_SERVICE_REQUEST"
  );

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-500/25 via-violet-500/20 to-fuchsia-500/25 backdrop-blur">
      <div className="p-4 border-b border-purple-400/60">
        <p className="text-sm font-semibold text-purple-50">
          Guest Request Notifications
        </p>
        <p className="text-[11px] text-purple-100/90">
          Room service, housekeeping, and special guest requests.
        </p>
      </div>
      <div className="p-3 text-xs text-purple-50 space-y-1.5">
        {guestAlerts.length === 0 ? (
          <p className="text-purple-100/85">
            No pending guest requests at the moment.
          </p>
        ) : (
          <>
            <p className="font-semibold">
              {guestAlerts.length} guest request(s) require attention.
            </p>
            <ul className="space-y-0.5 max-h-28 overflow-auto">
              {guestAlerts.slice(0, 5).map((n) => (
                <li key={n.id} className="text-[11px]">
                  • {n.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Card>
  );
}

