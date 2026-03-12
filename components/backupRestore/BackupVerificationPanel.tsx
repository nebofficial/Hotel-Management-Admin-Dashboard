"use client";

import { Card } from "@/components/ui/card";

type Props = {
  backups: { id: string; verificationStatus: string }[];
};

export function BackupVerificationPanel({ backups }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Backup Verification
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Integrity and compatibility status for recent backups.
        </p>
      </div>
      <div className="p-4 text-[11px] space-y-1.5 max-h-56 overflow-auto">
        {backups.map((b) => (
          <div
            key={b.id}
            className="flex justify-between gap-3 rounded-md border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-50"
          >
            <span>Backup {b.id.slice(0, 8)}</span>
            <span className="font-semibold">
              {b.verificationStatus || "Not Verified"}
            </span>
          </div>
        ))}
        {backups.length === 0 && (
          <p className="text-slate-600 dark:text-slate-300">
            No backups available to verify yet.
          </p>
        )}
      </div>
    </Card>
  );
}

