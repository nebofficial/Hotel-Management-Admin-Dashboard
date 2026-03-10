"use client";

import { Card } from "@/components/ui/card";

type Props = {
  lastBackupAt: string;
  nextBackupAt: string;
  status: string;
};

export function BackupStatusOverview({
  lastBackupAt,
  nextBackupAt,
  status,
}: Props) {
  const statusColor =
    status === "success"
      ? "text-emerald-700 dark:text-emerald-300"
      : status === "failed"
      ? "text-red-600 dark:text-red-300"
      : "text-amber-700 dark:text-amber-300";

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
          Backup Status Overview
        </p>
        <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
          Monitor last backup and upcoming schedule.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
            Last Backup
          </p>
          <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
            {lastBackupAt ? new Date(lastBackupAt).toLocaleString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
            Next Backup
          </p>
          <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
            {nextBackupAt ? new Date(nextBackupAt).toLocaleString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
            Status
          </p>
          <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
        </div>
      </div>
    </Card>
  );
}

