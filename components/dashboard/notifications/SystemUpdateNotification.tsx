"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  all: NotificationItem[];
};

export function SystemUpdateNotification({ all }: Props) {
  const update = all.find(
    (n) => n.type === "SYSTEM_UPDATE" || n.type === "SYSTEM_UPDATES"
  );

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/25 via-blue-500/20 to-indigo-500/25 backdrop-blur">
      <div className="p-4 border-b border-sky-400/60">
        <p className="text-sm font-semibold text-sky-50">
          System Update Notifications
        </p>
        <p className="text-[11px] text-sky-100/90">
          Keep your hotel management system secure and up to date.
        </p>
      </div>
      <div className="p-3 text-xs text-sky-50 space-y-1.5">
        {update ? (
          <>
            <p className="font-semibold">{update.title}</p>
            <p className="text-sky-100/90">
              {update.message || "New version or security patch is available."}
            </p>
          </>
        ) : (
          <p className="text-sky-100/90">
            No pending system updates. You are running the latest version that
            we know of.
          </p>
        )}
      </div>
    </Card>
  );
}

