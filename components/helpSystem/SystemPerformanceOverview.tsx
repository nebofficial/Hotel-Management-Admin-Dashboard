"use client";

import { Card } from "@/components/ui/card";

type Props = {
  cpuLoad: number;
  usedMem: number;
  totalMem: number;
  uptimeSeconds: number;
  nodeVersion: string;
};

export function SystemPerformanceOverview({
  cpuLoad,
  usedMem,
  totalMem,
  uptimeSeconds,
  nodeVersion,
}: Props) {
  const memPercent =
    totalMem > 0 ? Math.round((usedMem / totalMem) * 100) : 0;
  const uptimeHours = Math.floor(uptimeSeconds / 3600);

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          System Performance Overview
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Snapshot of server performance and uptime.
        </p>
      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
            CPU Load (1 min)
          </p>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
            {cpuLoad.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
            Memory Usage
          </p>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
            {memPercent}%
          </p>
          <div className="mt-1 h-1.5 w-full rounded-full bg-emerald-900/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(memPercent, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
            Uptime
          </p>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
            {uptimeHours}h
          </p>
        </div>
        <div>
          <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
            Node Version
          </p>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
            {nodeVersion}
          </p>
        </div>
      </div>
    </Card>
  );
}

