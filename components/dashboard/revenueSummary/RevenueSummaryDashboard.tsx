"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchDailyRevenue,
  fetchWeeklyRevenue,
  fetchMonthlyRevenue,
  fetchRoomRevenue,
  fetchRestaurantRevenue,
  fetchRevenueTrend,
  fetchRevenueComparison,
} from "@/services/api/revenueSummaryApi";
import { RevenueFilters } from "./RevenueFilters";
import { DailyRevenueCard } from "./DailyRevenueCard";
import { WeeklyRevenueSummary } from "./WeeklyRevenueSummary";
import { MonthlyRevenueSummary } from "./MonthlyRevenueSummary";
import { RoomRevenueBreakdown } from "./RoomRevenueBreakdown";
import { RestaurantRevenueBreakdown } from "./RestaurantRevenueBreakdown";
import { RevenueGrowthIndicator } from "./RevenueGrowthIndicator";
import { RevenueComparisonChart } from "./RevenueComparisonChart";
import { RevenueVisualizationChart } from "./RevenueVisualizationChart";

type Filters = {
  startDate?: string;
  endDate?: string;
};

export default function RevenueSummaryDashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [daily, setDaily] = useState<any | null>(null);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [room, setRoom] = useState<any | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiBase =
        (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://localhost:5000") +
        `/api/hotel-data/${user.hotelId}/reports-dashboard`;

      const params: Record<string, string> = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const [
        dailyRes,
        weeklyRes,
        monthlyRes,
        roomRes,
        restaurantRes,
        trendRes,
        comparisonRes,
      ] = await Promise.all([
        fetchDailyRevenue(apiBase, params),
        fetchWeeklyRevenue(apiBase, params),
        fetchMonthlyRevenue(apiBase, params),
        fetchRoomRevenue(apiBase, params),
        fetchRestaurantRevenue(apiBase, params),
        fetchRevenueTrend(apiBase, params),
        fetchRevenueComparison(apiBase, params),
      ]);

      setDaily(dailyRes);
      setWeekly(weeklyRes.trend || []);
      setMonthly(monthlyRes.byDate || []);
      setRoom(roomRes);
      setRestaurant(restaurantRes);
      setTrend(trendRes || []);
      setComparison(comparisonRes);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load revenue summary",
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
        <h1 className="text-lg font-semibold">Revenue Summary</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to view revenue dashboards.
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Revenue Summary</h1>
          <p className="text-xs text-muted-foreground">
            Comprehensive overview of hotel revenue across rooms and restaurant.
          </p>
        </div>
        <RevenueFilters
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
          Loading revenue analytics...
        </p>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] gap-4">
        <div className="space-y-3">
          <DailyRevenueCard daily={daily} />
          <WeeklyRevenueSummary trend={weekly} />
          <MonthlyRevenueSummary byDate={monthly} />
          <RevenueVisualizationChart trend={trend} />
        </div>
        <div className="space-y-3">
          <RoomRevenueBreakdown room={room} />
          <RestaurantRevenueBreakdown restaurant={restaurant} />
          <RevenueGrowthIndicator trend={trend} />
          <RevenueComparisonChart comparison={comparison} />
        </div>
      </section>
    </main>
  );
}

