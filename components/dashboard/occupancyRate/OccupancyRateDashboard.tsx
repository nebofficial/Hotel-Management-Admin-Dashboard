"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchOccupancySummary,
  fetchDailyOccupancy,
  fetchWeeklyOccupancy,
  fetchMonthlyOccupancy,
  fetchRoomTypeOccupancy,
  fetchOccupancyComparison,
  fetchOccupancyForecast,
} from "@/services/api/occupancyApi";
import { DailyOccupancyCard } from "./DailyOccupancyCard";
import { WeeklyOccupancyTrendChart } from "./WeeklyOccupancyTrendChart";
import { MonthlyOccupancyStats } from "./MonthlyOccupancyStats";
import { RoomTypeOccupancyChart } from "./RoomTypeOccupancyChart";
import { OccupancyComparisonChart } from "./OccupancyComparisonChart";
import { AvailableVsOccupiedChart } from "./AvailableVsOccupiedChart";
import { OccupancyForecastChart } from "./OccupancyForecastChart";
import { OccupancyFilters } from "./OccupancyFilters";

type Filters = {
  startDate?: string;
  endDate?: string;
  roomType?: string;
};

export default function OccupancyRateDashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<any | null>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.roomType && filters.roomType !== "ALL") {
        params.roomType = filters.roomType;
      }

      const [
        summaryRes,
        dailyRes,
        weeklyRes,
        monthlyRes,
        roomTypeRes,
        comparisonRes,
        forecastRes,
      ] = await Promise.all([
        fetchOccupancySummary(user.hotelId, params),
        fetchDailyOccupancy(user.hotelId, params),
        fetchWeeklyOccupancy(user.hotelId, params),
        fetchMonthlyOccupancy(user.hotelId, params),
        fetchRoomTypeOccupancy(user.hotelId, params),
        fetchOccupancyComparison(user.hotelId, params),
        fetchOccupancyForecast(user.hotelId, params),
      ]);

      setSummary(summaryRes);
      setDaily(dailyRes.daily || []);
      setWeekly(weeklyRes.weekly || []);
      setMonthly(monthlyRes.monthly || []);
      setRoomTypes(roomTypeRes.roomTypeOccupancy || []);
      setComparison(comparisonRes);
      setForecast(forecastRes.forecast || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load occupancy dashboards",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId, filters]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <h1 className="text-lg font-semibold">Occupancy Rate</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to view occupancy analytics.
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Occupancy Rate</h1>
          <p className="text-xs text-muted-foreground">
            Understand how your rooms are utilized across days, weeks, and
            months.
          </p>
        </div>
        <OccupancyFilters
          filters={filters}
          onChange={setFilters}
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
        <p className="text-xs text-muted-foreground">
          Loading occupancy analytics...
        </p>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] gap-4">
        <div className="space-y-3">
          <DailyOccupancyCard summary={summary} />
          <WeeklyOccupancyTrendChart weekly={weekly} />
          <MonthlyOccupancyStats monthly={monthly} />
        </div>
        <div className="space-y-3">
          <RoomTypeOccupancyChart items={roomTypes} />
          <OccupancyComparisonChart comparison={comparison} />
          <AvailableVsOccupiedChart summary={summary} />
          <OccupancyForecastChart forecast={forecast} />
        </div>
      </section>
    </main>
  );
}

