"use client";

import { useEffect, useState } from "react";
import {
  exportLogs,
  fetchActivityLogs,
  fetchErrorLogs,
  fetchLoginLogs,
  filterLogs,
} from "@/services/api/activityLogsApi";
import { LoginActivityLogs } from "./LoginActivityLogs";
import { SystemConfigLogs } from "./SystemConfigLogs";
import { DataModificationLogs } from "./DataModificationLogs";
import { ModuleUsageLogs } from "./ModuleUsageLogs";
import { ErrorLogs } from "./ErrorLogs";
import { LogFilters, LogFiltersValue } from "./LogFilters";
import { ExportLogsButton } from "./ExportLogsButton";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LogRecord = {
  id: string;
  type: string;
  module?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  createdAt: string;
};

export default function ActivityLogsDashboard() {
  const [allLogs, setAllLogs] = useState<LogRecord[]>([]);
  const [loginLogs, setLoginLogs] = useState<LogRecord[]>([]);
  const [errorLogs, setErrorLogs] = useState<LogRecord[]>([]);
  const [filters, setFilters] = useState<LogFiltersValue>({ type: "all" });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [allRes, loginRes, errorRes] = await Promise.all([
          fetchActivityLogs(),
          fetchLoginLogs(),
          fetchErrorLogs(),
        ]);
        if (cancelled) return;
        setAllLogs(allRes.items || []);
        setLoginLogs(loginRes.items || []);
        setErrorLogs(errorRes.items || []);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load activity logs",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyFilters = async (values: LogFiltersValue) => {
    try {
      setFilters(values);
      setLoading(true);
      setError(null);
      const [allRes, loginRes, errorRes] = await Promise.all([
        filterLogs(values),
        fetchLoginLogs(values),
        fetchErrorLogs(values),
      ]);
      setAllLogs(allRes.items || []);
      setLoginLogs(loginRes.items || []);
      setErrorLogs(errorRes.items || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to apply log filters",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    try {
      setExporting(true);
      const res = await exportLogs(filters, format);
      const rows = res.rows || [];
      if (!rows.length) return;

      const header = Object.keys(rows[0]);
      const lines = [
        header.join(","),
        ...rows.map((r: any) =>
          header
            .map((key) =>
              String(r[key] ?? "")
                .replace(/"/g, '""')
                .includes(",")
                ? `"${String(r[key]).replace(/"/g, '""')}"`
                : String(r[key]),
            )
            .join(","),
        ),
      ];
      const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `activity-logs-${format}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Activity Logs</h1>
          <p className="text-xs text-muted-foreground">
            Track user logins, configuration changes, data updates, module
            usage, and system errors.
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
          Loading activity logs...
        </p>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-4">
        <div className="space-y-3">
          <LoginActivityLogs logs={loginLogs as any} />
          <SystemConfigLogs logs={allLogs as any} />
          <DataModificationLogs logs={allLogs as any} />
        </div>

        <div className="space-y-3">
          <ModuleUsageLogs logs={allLogs as any} />
          <ErrorLogs logs={errorLogs as any} />
          <LogFilters onApply={handleApplyFilters} />
          <ExportLogsButton onExport={handleExport} />
          {exporting && (
            <p className="text-[11px] text-muted-foreground">
              Preparing export...
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

