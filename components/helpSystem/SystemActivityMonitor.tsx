"use client";

import { Card } from "@/components/ui/card";

type ActivityItem = {
  id: string;
  message: string;
  createdAt: string;
};

type Props = {
  items: ActivityItem[];
};

export function SystemActivityMonitor({ items }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-amber-300/10 via-yellow-300/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">
          System Activity Monitoring
        </p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Recent logins, configuration changes, and important updates.
        </p>
      </div>
      <div className="p-4 space-y-2 text-[11px] max-h-56 overflow-auto">
        {items.length === 0 && (
          <p className="text-amber-900/70 dark:text-amber-100/80">
            No recent activity.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 rounded-md bg-white/70 dark:bg-slate-900/60 px-3 py-2 border border-amber-200/60 dark:border-amber-600/40"
          >
            <span className="text-amber-950 dark:text-amber-50">
              {item.message}
            </span>
            <span className="whitespace-nowrap text-amber-900/70 dark:text-amber-100/80">
              {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

