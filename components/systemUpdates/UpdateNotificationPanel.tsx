"use client";

import { Card } from "@/components/ui/card";
import type { UpdateNotification } from "./SystemUpdatesDashboard";

type Props = {
  notifications: UpdateNotification[];
};

export function UpdateNotificationPanel({ notifications }: Props) {
  const hasAny = notifications && notifications.length > 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/25 via-amber-300/20 to-orange-300/25 backdrop-blur">
      <div className="p-4 border-b border-amber-400/60">
        <p className="text-sm font-semibold text-amber-900">
          Update Notifications
        </p>
        <p className="text-[11px] text-amber-900/80">
          Stay informed about new versions and important security advisories.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        {!hasAny && (
          <p className="text-[11px] text-amber-900/80">
            No active notifications. You will see alerts here whenever new
            updates or patches are detected.
          </p>
        )}

        {hasAny &&
          notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-md bg-white/80 border border-amber-400/60 px-3 py-2 text-[11px] text-amber-900"
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="font-semibold text-[12px]">{n.title}</p>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                    n.type === "security"
                      ? "bg-red-500/15 text-red-800 border border-red-500/40"
                      : "bg-emerald-500/15 text-emerald-800 border border-emerald-500/40"
                  }`}
                >
                  {n.type === "security" ? "Security" : "Update"}
                </span>
              </div>
              {n.code && (
                <p className="text-[10px] text-amber-800/80 mb-0.5">
                  Reference: {n.code}
                </p>
              )}
              <p className="text-[11px] text-amber-900/90">{n.message}</p>
            </div>
          ))}
      </div>
    </Card>
  );
}

