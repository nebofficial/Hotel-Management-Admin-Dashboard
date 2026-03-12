"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  onBackup: (scope: "Full" | "Database" | "Files") => Promise<void>;
};

export function ManualBackupPanel({ onBackup }: Props) {
  const [scope, setScope] = useState<"Full" | "Database" | "Files">("Full");
  const [running, setRunning] = useState(false);

  const handleBackup = async () => {
    setRunning(true);
    try {
      await onBackup(scope);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
          Manual System Backup
        </p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Start a backup instantly for the entire system or a specific scope.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Backup Scope</Label>
          <div className="flex flex-wrap gap-2">
            {["Full", "Database", "Files"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s as any)}
                className={`px-3 py-1.5 rounded-full border text-[11px] ${
                  scope === s
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-200 bg-white/80 dark:bg-slate-900/60 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            className="bg-sky-600 text-white"
            onClick={handleBackup}
            disabled={running}
          >
            {running ? "Creating backup..." : "Start Backup"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

