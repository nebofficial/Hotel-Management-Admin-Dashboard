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

export function RecentSupportActivity({ items }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Recent Support Activity
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Ticket updates, resolved issues, and support responses.
        </p>
      </div>
      <div className="p-4 space-y-2 text-[11px] max-h-56 overflow-auto">
        {items.length === 0 && (
          <p className="text-slate-700 dark:text-slate-300">
            No recent support activity.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 rounded-md bg-white/80 px-3 py-2 text-slate-800 shadow-sm dark:bg-slate-900/70 dark:text-slate-50"
          >
            <span>{item.message}</span>
            <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
              {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

