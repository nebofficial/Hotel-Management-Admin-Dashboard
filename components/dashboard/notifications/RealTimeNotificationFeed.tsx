"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  items: NotificationItem[];
};

export function RealTimeNotificationFeed({ items }: Props) {
  const data = (items || []).slice(0, 15);

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/20 via-emerald-400/20 to-violet-500/25 backdrop-blur">
      <div className="p-4 border-b border-sky-400/50">
        <p className="text-sm font-semibold text-slate-900">
          Real-time Notification Feed
        </p>
        <p className="text-[11px] text-slate-800">
          Latest operational events across the property.
        </p>
      </div>
      <div className="p-3 max-h-56 overflow-auto text-xs space-y-1.5">
        {data.length === 0 ? (
          <p className="text-slate-800">
            No notifications yet. You&apos;ll see new events as they occur.
          </p>
        ) : (
          data.map((n) => (
            <div
              key={n.id}
              className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-slate-900">
                  {n.title}
                </p>
                <span className="text-[10px] text-slate-500">
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
              {n.message && (
                <p className="text-[11px] text-slate-700">{n.message}</p>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

