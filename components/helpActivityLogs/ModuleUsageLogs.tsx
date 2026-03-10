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

export function ModuleUsageLogs({ logs }: Props) {
  const moduleLogs = logs.filter((l) => l.type === "module");

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-300/10 backdrop-blur">
      <div className="p-4 border-b border-amber-300/60">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">
          Module Usage Logs
        </p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Which modules are being accessed and by whom.
        </p>
      </div>
      <div className="p-4 space-y-1.5 text-[11px] max-h-56 overflow-auto">
        {moduleLogs.map((log) => (
          <div
            key={log.id}
            className="flex justify-between gap-3 rounded-md border border-amber-200/70 bg-white/70 px-3 py-1.5 dark:border-amber-700/50 dark:bg-slate-900/60"
          >
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-50">
                {log.module || "Module"}
              </p>
              <p className="text-amber-900/80 dark:text-amber-100/80">
                {log.action}
              </p>
            </div>
            <div className="text-right text-amber-900/70 dark:text-amber-100/70 whitespace-nowrap">
              <p>{log.userName || "System"}</p>
              <p>{new Date(log.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {moduleLogs.length === 0 && (
          <p className="text-amber-900/70 dark:text-amber-100/80">
            No module usage logs found for the selected filters.
          </p>
        )}
      </div>
    </Card>
  );
}

