"use client";

import { Card } from "@/components/ui/card";

type Log = {
  id: string;
  createdAt: string;
  userName?: string;
  module?: string;
  action: string;
};

type Props = {
  logs: Log[];
};

export function SystemConfigLogs({ logs }: Props) {
  const configLogs = logs.filter((l) => l.type === "config" || /updated|changed/i.test(l.action));

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          System Configuration Changes
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Track who changed system settings and when.
        </p>
      </div>
      <div className="p-4 space-y-1.5 text-[11px] max-h-56 overflow-auto">
        {configLogs.map((log) => (
          <div
            key={log.id}
            className="rounded-md border border-emerald-200/70 bg-white/70 px-3 py-1.5 dark:border-emerald-700/50 dark:bg-slate-900/60"
          >
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-emerald-900 dark:text-emerald-50">
                {log.action}
              </span>
              <span className="text-emerald-900/70 dark:text-emerald-100/70 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-emerald-900/80 dark:text-emerald-100/80">
              {log.userName || "System"} · {log.module || "Settings"}
            </p>
          </div>
        ))}
        {configLogs.length === 0 && (
          <p className="text-emerald-900/70 dark:text-emerald-100/80">
            No configuration changes found for the selected filters.
          </p>
        )}
      </div>
    </Card>
  );
}

