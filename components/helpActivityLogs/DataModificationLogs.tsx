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

export function DataModificationLogs({ logs }: Props) {
  const dataLogs = logs.filter((l) => l.type === "data");

  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/40">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Data Modification History
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Created, updated, and deleted records across the system.
        </p>
      </div>
      <div className="p-4 space-y-1.5 text-[11px] max-h-56 overflow-auto">
        {dataLogs.map((log) => (
          <div
            key={log.id}
            className="rounded-md border border-violet-200/70 bg-white/70 px-3 py-1.5 dark:border-violet-700/50 dark:bg-slate-900/60"
          >
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-violet-900 dark:text-violet-50">
                {log.action}
              </span>
              <span className="text-violet-900/70 dark:text-violet-100/70 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-violet-900/80 dark:text-violet-100/80">
              {log.module || "Data"} · {log.userName || "System"}
            </p>
          </div>
        ))}
        {dataLogs.length === 0 && (
          <p className="text-violet-900/70 dark:text-violet-100/80">
            No data modification logs found for the selected filters.
          </p>
        )}
      </div>
    </Card>
  );
}

