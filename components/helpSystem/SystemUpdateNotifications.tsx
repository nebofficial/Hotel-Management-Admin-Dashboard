"use client";

import { Card } from "@/components/ui/card";

type UpdateItem = {
  id: string;
  type: string;
  message: string;
  severity: string;
};

type Props = {
  currentVersion: string;
  updatesAvailable: boolean;
  items: UpdateItem[];
};

export function SystemUpdateNotifications({
  currentVersion,
  updatesAvailable,
  items,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-amber-500/10 backdrop-blur">
      <div className="p-4 border-b border-red-500/40 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-red-900 dark:text-red-50">
            System Update Notifications
          </p>
          <p className="text-[11px] text-red-900/70 dark:text-red-100/80">
            Security patches and version upgrades.
          </p>
        </div>
        <div className="text-[11px] text-right">
          <p className="text-red-900/80 dark:text-red-100/80">
            Version {currentVersion}
          </p>
          <p className="font-semibold text-red-900 dark:text-red-50">
            {updatesAvailable ? "Updates available" : "Up to date"}
          </p>
        </div>
      </div>
      <div className="p-4 space-y-2 text-[11px]">
        {items.length === 0 && (
          <p className="text-red-900/70 dark:text-red-100/80">
            No pending update notifications.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 rounded-md border border-red-200/60 bg-white/70 px-3 py-2 dark:bg-slate-900/60 dark:border-red-700/40"
          >
            <span
              className={`mt-0.5 inline-flex h-4 min-w-12 items-center justify-center rounded-full px-2 text-[10px] font-semibold ${
                item.severity === "high"
                  ? "bg-red-600 text-white"
                  : item.severity === "medium"
                  ? "bg-amber-500 text-amber-50"
                  : "bg-slate-700 text-slate-50"
              }`}
            >
              {item.type}
            </span>
            <span className="text-red-900/80 dark:text-red-100/80">
              {item.message}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

