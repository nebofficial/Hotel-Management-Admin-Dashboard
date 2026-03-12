"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchOverviewSummary,
  fetchRevenueTrend,
  fetchOccupancyTrend,
} from "@/services/api/overviewApi";
import { KPIFilters } from "./KPIFilters";
import { KPICards } from "./KPICards";
import { RevenueGrowthIndicator } from "./RevenueGrowthIndicator";
import { OccupancyTrendIndicator } from "./OccupancyTrendIndicator";
import { KPIComparisonPanel } from "./KPIComparisonPanel";
import { KPIAnalyticsCharts } from "./KPIAnalyticsCharts";

type Period = "today" | "weekly" | "monthly" | "custom";

export default function OverviewKPIsDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("today");
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [revenueKpi, setRevenueKpi] = useState<any>(null);
  const [occupancyKpi, setOccupancyKpi] = useState<any>(null);
  const [availableRoomsKpi, setAvailableRoomsKpi] = useState<any>(null);
  const [checkinsTodayKpi, setCheckinsTodayKpi] = useState<any>(null);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [occupancyTrend, setOccupancyTrend] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { period };
      if (period === "custom" && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const [summary, revTrend, occTrend] = await Promise.all([
        fetchOverviewSummary(user.hotelId, params),
        fetchRevenueTrend(user.hotelId, params),
        fetchOccupancyTrend(user.hotelId, params),
      ]);

      setRevenueKpi(summary.revenueKpi || null);
      setOccupancyKpi(summary.occupancyKpi || null);
      setAvailableRoomsKpi(summary.availableRoomsKpi || null);
      setCheckinsTodayKpi(summary.checkinsTodayKpi || null);
      setRevenueTrend(revTrend.trend || []);
      setOccupancyTrend(occTrend.trend || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load overview KPIs"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId, period, startDate, endDate]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <h1 className="text-lg font-semibold">KPI Overview</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to view performance KPIs.
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Overview / KPIs</h1>
          <p className="text-xs text-muted-foreground">
            Real-time snapshot of revenue, occupancy, and daily performance.
          </p>
        </div>
        <KPIFilters
          period={period}
          startDate={startDate}
          endDate={endDate}
          onChange={(next) => {
            setPeriod(next.period);
            setStartDate(next.startDate);
            setEndDate(next.endDate);
          }}
          onApply={() => {
            void load();
          }}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <p className="text-xs text-muted-foreground">Loading KPIs...</p>
      )}

      <section className="space-y-3">
        <KPICards
          revenue={revenueKpi}
          occupancy={occupancyKpi}
          availableRooms={availableRoomsKpi}
          checkinsToday={checkinsTodayKpi}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] gap-3">
          <RevenueGrowthIndicator revenue={revenueKpi} />
          <OccupancyTrendIndicator trend={occupancyTrend} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] gap-3">
          <KPIComparisonPanel revenue={revenueKpi} occupancy={occupancyKpi} />
          <KPIAnalyticsCharts
            revenueTrend={revenueTrend}
            occupancyTrend={occupancyTrend}
          />
        </div>
      </section>
    </main>
  );
}

