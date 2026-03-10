"use client";

import { useEffect, useState } from "react";
import {
  fetchIntegrationSummary,
  fetchSystemHealth,
  fetchRecentConfigActivity,
} from "@/services/api/settingsDashboardApi";
import { SettingsHeader } from "./SettingsHeader";
import { SystemOverviewCards } from "./SystemOverviewCards";
import { SystemHealthAndUsage } from "./SystemHealthAndUsage";
import { RecentConfigActivity } from "./RecentConfigActivity";
import { SystemPerformanceCharts } from "./SystemPerformanceCharts";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export default function SettingsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<any | null>(null);
  const [health, setHealth] = useState<any | null>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [ov, h, act] = await Promise.all([
          fetchIntegrationSummary(API_BASE),
          fetchSystemHealth(API_BASE),
          fetchRecentConfigActivity(API_BASE),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setHealth(h);
        setActivity(act.items || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load settings dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="p-4 md:p-6 space-y-4">
      <SettingsHeader />

      {error && (
        <Alert variant="destructive" className="max-w-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SystemOverviewCards
        activeIntegrations={overview?.activeIntegrations ?? 0}
        totalUsers={overview?.totalUsers ?? 0}
        activeUsers={overview?.activeUsers ?? 0}
        activeSessions={overview?.activeSessions ?? 0}
        systemStatus={overview?.systemStatus ?? "Unknown"}
      />

      <SystemHealthAndUsage health={health} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SystemPerformanceCharts />
        <RecentConfigActivity items={activity} />
      </div>

      {loading && (
        <p className="text-xs text-muted-foreground mt-2">
          Loading latest settings metrics...
        </p>
      )}
    </main>
  );
}

