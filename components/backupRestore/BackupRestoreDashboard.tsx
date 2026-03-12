"use client";

import { useEffect, useState } from "react";
import {
  createBackup,
  scheduleBackup,
  fetchBackupHistory,
  downloadBackup,
  restoreBackup,
  verifyBackup,
} from "@/services/api/backupApi";
import { ManualBackupPanel } from "./ManualBackupPanel";
import { ScheduledBackupSettings } from "./ScheduledBackupSettings";
import { BackupHistoryTable } from "./BackupHistoryTable";
import { RestoreBackupPanel } from "./RestoreBackupPanel";
import { BackupVerificationPanel } from "./BackupVerificationPanel";
import { BackupStorageSettings } from "./BackupStorageSettings";
import { Alert, AlertDescription } from "@/components/ui/alert";

type BackupJob = {
  id: string;
  createdAt: string;
  type: string;
  scope: string;
  sizeBytes?: number;
  status: string;
  verificationStatus?: string;
};

export default function BackupRestoreDashboard() {
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBackupHistory();
      setBackups(res.items || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load backup history",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const handleBackup = async (scope: "Full" | "Database" | "Files") => {
    try {
      setError(null);
      await createBackup(scope);
      await loadHistory();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create backup");
    }
  };

  const handleSchedule = async (payload: {
    frequency: string;
    timeOfDay: string;
    retentionDays: number;
  }) => {
    try {
      setError(null);
      await scheduleBackup(payload);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to schedule backup");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      setError(null);
      const res = await downloadBackup(id);
      if (res.filePath && typeof window !== "undefined") {
        window.open(res.filePath, "_blank");
      }
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to get download link",
      );
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setError(null);
      await restoreBackup(id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to restore backup");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setError(null);
      await verifyBackup(id);
      await loadHistory();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to verify backup");
    }
  };

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Backup &amp; Restore</h1>
          <p className="text-xs text-muted-foreground">
            Create backups, configure schedules, and restore the system safely.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <p className="text-xs text-muted-foreground">
          Loading backup information...
        </p>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-4">
        <div className="space-y-3">
          <ManualBackupPanel onBackup={handleBackup} />
          <ScheduledBackupSettings onSchedule={handleSchedule} />
          <BackupHistoryTable
            items={backups}
            onDownload={handleDownload}
            onVerify={handleVerify}
          />
        </div>

        <div className="space-y-3">
          <RestoreBackupPanel
            backups={backups}
            onRestore={handleRestore}
          />
          <BackupVerificationPanel backups={backups} />
          <BackupStorageSettings />
        </div>
      </section>
    </main>
  );
}

