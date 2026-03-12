"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  all: NotificationItem[];
};

export function StaffAlertNotification({ all }: Props) {
  const staffAlerts = all.filter(
    (n) => n.type === "STAFF_ALERT" || n.type === "SHIFT_ALERT"
  );

  return (
    <Card className="border-0 bg-gradient-to-br from-amber-800/40 via-orange-700/30 to-yellow-700/30 backdrop-blur">
      <div className="p-4 border-b border-amber-600/70">
        <p className="text-sm font-semibold text-amber-50">Staff Alerts</p>
        <p className="text-[11px] text-amber-100/90">
          Absences, shift changes, and HR notifications.
        </p>
      </div>
      <div className="p-3 text-xs text-amber-50 space-y-1.5">
        {staffAlerts.length === 0 ? (
          <p className="text-amber-100/85">
            No staff alerts right now. All shifts look normal.
          </p>
        ) : (
          <>
            <p className="font-semibold">
              {staffAlerts.length} staff alert(s) active.
            </p>
            <ul className="space-y-0.5 max-h-24 overflow-auto">
              {staffAlerts.slice(0, 5).map((n) => (
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

