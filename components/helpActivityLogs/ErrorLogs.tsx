"use client";

import { Card } from "@/components/ui/card";

type Log = {
  id: string;
  createdAt: string;
  module?: string;
  action: string;
};

type Props = {
  logs: Log[];
};

export function ErrorLogs({ logs }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-amber-500/10 backdrop-blur">
      <div className="p-4 border-b border-red-500/40">
        <p className="text-sm font-semibold text-red-900 dark:text-red-50">
          Error Logs
        </p>
        <p className="text-[11px] text-red-900/70 dark:text-red-100/80">
          System errors, API failures, and exception messages.
        </p>
      </div>
      <div className="p-4 space-y-1.5 text-[11px] max-h-56 overflow-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-md border border-red-200/70 bg-white/80 px-3 py-1.5 dark:border-red-700/50 dark:bg-slate-900/60"
          >
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-red-900 dark:text-red-50">
                {log.action}
              </span>
              <span className="text-red-900/70 dark:text-red-100/70 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-red-900/80 dark:text-red-100/80">
              Module: {log.module || "Unknown"}
            </p>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-red-900/70 dark:text-red-100/80">
            No error logs found for the selected filters.
          </p>
        )}
      </div>
    </Card>
  );
}

