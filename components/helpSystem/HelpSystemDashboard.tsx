"use client";

import { useEffect, useState } from "react";
import {
  fetchBackupStatus,
  fetchRecentActivity,
  fetchSupportTickets,
  fetchSystemHealth,
  fetchSystemUpdates,
  fetchUsageAnalytics,
} from "@/services/api/helpSystemApi";
import { SystemPerformanceOverview } from "./SystemPerformanceOverview";
import { HelpResourcesSummary } from "./HelpResourcesSummary";
import { SupportTicketsWidget } from "./SupportTicketsWidget";
import { SystemActivityMonitor } from "./SystemActivityMonitor";
import { BackupStatusOverview } from "./BackupStatusOverview";
import { SystemUpdateNotifications } from "./SystemUpdateNotifications";
import { RecentSupportActivity } from "./RecentSupportActivity";
import { SystemUsageAnalytics } from "./SystemUsageAnalytics";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Health = {
  cpuLoad: number;
  totalMem: number;
  freeMem: number;
  usedMem: number;
  uptimeSeconds: number;
  nodeVersion: string;
};

type Tickets = {
  totalOpen: number;
  highPriority: number;
  recentCreated: number;
};

type Backup = {
  lastBackupAt: string;
  nextBackupAt: string;
  status: string;
};

type Updates = {
  currentVersion: string;
  updatesAvailable: boolean;
  items: { id: string; type: string; message: string; severity: string }[];
};

type ActivityItem = {
  id: string;
  message: string;
  createdAt: string;
};

type UsageAnalytics = {
  dailyUsage: { date: string; activeUsers: number; apiRequests: number }[];
  featureUsage: { feature: string; value: number }[];
};

export default function HelpSystemDashboard() {
  const [health, setHealth] = useState<Health | null>(null);
  const [tickets, setTickets] = useState<Tickets | null>(null);
  const [backup, setBackup] = useState<Backup | null>(null);
  const [updates, setUpdates] = useState<Updates | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [usage, setUsage] = useState<UsageAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        setLoading(true);
        setError(null);
        const [
          healthRes,
          ticketsRes,
          backupRes,
          updatesRes,
          recentRes,
          usageRes,
        ] = await Promise.all([
          fetchSystemHealth(),
          fetchSupportTickets(),
          fetchBackupStatus(),
          fetchSystemUpdates(),
          fetchRecentActivity(),
          fetchUsageAnalytics(),
        ]);
        if (cancelled) return;
        setHealth(healthRes);
        setTickets(ticketsRes);
        setBackup(backupRes);
        setUpdates(updatesRes);
        setRecentActivity(recentRes.items || []);
        setUsage(usageRes);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load help & system data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Help & System Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Monitor system health, backups, updates, and support activity from
            one place.
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
          {health && (
            <SystemPerformanceOverview
              cpuLoad={health.cpuLoad}
              usedMem={health.usedMem}
              totalMem={health.totalMem}
              uptimeSeconds={health.uptimeSeconds}
              nodeVersion={health.nodeVersion}
            />
          )}
          <HelpResourcesSummary />
          {tickets && (
            <SupportTicketsWidget
              totalOpen={tickets.totalOpen}
              highPriority={tickets.highPriority}
              recentCreated={tickets.recentCreated}
            />
          )}
          <SystemActivityMonitor items={recentActivity} />
        </div>

        <div className="space-y-3">
          {backup && (
            <BackupStatusOverview
              lastBackupAt={backup.lastBackupAt}
              nextBackupAt={backup.nextBackupAt}
              status={backup.status}
            />
          )}
          {updates && (
            <SystemUpdateNotifications
              currentVersion={updates.currentVersion}
              updatesAvailable={updates.updatesAvailable}
              items={updates.items || []}
            />
          )}
          <RecentSupportActivity items={recentActivity} />
          {usage && (
            <SystemUsageAnalytics
              dailyUsage={usage.dailyUsage}
              featureUsage={usage.featureUsage}
            />
          )}
        </div>
      </section>
    </main>
  );
}

