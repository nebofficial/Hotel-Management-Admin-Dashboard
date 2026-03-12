"use client";

import { useEffect, useState } from "react";
import {
  checkForUpdates,
  installUpdate,
  fetchUpdateHistory,
  applySecurityPatch,
  restartSystem,
} from "@/services/api/systemUpdateApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckUpdatesPanel } from "./CheckUpdatesPanel";
import { InstallUpdatePanel } from "./InstallUpdatePanel";
import { UpdateHistoryTable } from "./UpdateHistoryTable";
import { SecurityPatchPanel } from "./SecurityPatchPanel";
import { VersionInfoPanel } from "./VersionInfoPanel";
import { UpdateNotificationPanel } from "./UpdateNotificationPanel";
import { SystemRestartPanel } from "./SystemRestartPanel";

export type VersionInfo = {
  version: string;
  build?: string;
  releasedAt?: string;
};

export type AvailableUpdate = {
  id: string;
  version: string;
  type: string;
  title?: string;
  releasedAt?: string;
  notes?: string;
  status?: string;
};

export type SecurityPatch = {
  id: string;
  code?: string;
  severity?: string;
  title?: string;
  releasedAt?: string;
  notes?: string;
  status?: string;
  installedAt?: string;
};

export type UpdateHistoryItem = {
  id: string;
  version: string;
  type: string;
  title?: string;
  status: string;
  installedAt: string;
  notes?: string;
};

export type UpdateNotification = {
  id: string;
  type: "update" | "security";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  code?: string;
};

export default function SystemUpdatesDashboard() {
  const [currentVersion, setCurrentVersion] = useState<VersionInfo | null>(null);
  const [latestVersion, setLatestVersion] = useState<VersionInfo | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [availableUpdates, setAvailableUpdates] = useState<AvailableUpdate[]>([]);
  const [patches, setPatches] = useState<SecurityPatch[]>([]);
  const [notifications, setNotifications] = useState<UpdateNotification[]>([]);
  const [history, setHistory] = useState<UpdateHistoryItem[]>([]);
  const [checking, setChecking] = useState(false);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [restartState, setRestartState] = useState<{
    mode?: string;
    scheduledFor?: string;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = async () => {
    setError(null);
    try {
      const [checkRes, historyRes] = await Promise.all([
        checkForUpdates(),
        fetchUpdateHistory(),
      ]);
      setCurrentVersion(checkRes.currentVersion || null);
      setLatestVersion(checkRes.latestVersion || null);
      setHasUpdate(!!checkRes.hasUpdate);
      setAvailableUpdates(checkRes.availableUpdates || []);
      setPatches(checkRes.securityPatches || []);
      setNotifications(checkRes.notifications || []);
      setHistory(historyRes.items || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load system update status",
      );
    }
  };

  useEffect(() => {
    void loadInitial();
  }, []);

  const handleCheck = async () => {
    setChecking(true);
    setError(null);
    try {
      const res = await checkForUpdates();
      setCurrentVersion(res.currentVersion || null);
      setLatestVersion(res.latestVersion || null);
      setHasUpdate(!!res.hasUpdate);
      setAvailableUpdates(res.availableUpdates || []);
      setPatches(res.securityPatches || []);
      setNotifications(res.notifications || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to check for new updates",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleInstall = async (id: string) => {
    setInstallingId(id);
    setError(null);
    try {
      await installUpdate(id);
      await loadInitial();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to install update");
    } finally {
      setInstallingId(null);
    }
  };

  const handleApplyPatch = async (id: string) => {
    setPatchingId(id);
    setError(null);
    try {
      await applySecurityPatch(id);
      await loadInitial();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to apply security patch",
      );
    } finally {
      setPatchingId(null);
    }
  };

  const handleRestartNow = async () => {
    setError(null);
    try {
      const res = await restartSystem({ mode: "now" });
      setRestartState(res);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to trigger system restart",
      );
    }
  };

  const handleScheduleRestart = async (isoTime: string) => {
    setError(null);
    try {
      const res = await restartSystem({ mode: "schedule", scheduledFor: isoTime });
      setRestartState(res);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to schedule system restart",
      );
    }
  };

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">System Updates</h1>
          <p className="text-xs text-muted-foreground">
            Manage software updates, security patches, and version information.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-4">
        <div className="space-y-3">
          <CheckUpdatesPanel
            current={currentVersion}
            latest={latestVersion}
            hasUpdate={hasUpdate}
            checking={checking}
            onCheck={handleCheck}
          />
          <InstallUpdatePanel
            updates={availableUpdates}
            installingId={installingId}
            onInstall={handleInstall}
          />
          <UpdateHistoryTable items={history} />
        </div>

        <div className="space-y-3">
          <SecurityPatchPanel
            patches={patches}
            patchingId={patchingId}
            onApplyPatch={handleApplyPatch}
          />
          <VersionInfoPanel current={currentVersion} latest={latestVersion} />
          <UpdateNotificationPanel notifications={notifications} />
          <SystemRestartPanel
            restartState={restartState}
            onRestartNow={handleRestartNow}
            onScheduleRestart={handleScheduleRestart}
          />
        </div>
      </section>
    </main>
  );
}

