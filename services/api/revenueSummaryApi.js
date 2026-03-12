import {
  fetchRevenueSummary as fetchDashboardRevenueSummary,
  fetchReportsCharts,
} from "./reportsDashboardApi";
import { fetchRevenueByDateRange } from "./roomRevenueApi";
import { fetchRestaurantSales } from "./reportsDashboardApi";

// Daily revenue is derived from revenue summary's byDate slice
export async function fetchDailyRevenue(apiBase, params = {}) {
  const summary = await fetchDashboardRevenueSummary(apiBase, params);
  const byDate = summary.byDate || [];
  const today = new Date().toISOString().slice(0, 10);
  const todayRow =
    byDate.find((r) => r.date === today) || byDate[byDate.length - 1];
  const totalToday = todayRow?.total || 0;
  return {
    totalToday,
    currency: summary.currency || "INR",
    byDate,
  };
}

export async function fetchWeeklyRevenue(apiBase, params = {}) {
  // Use reports charts revenueTrend and aggregate per week on the client
  const charts = await fetchReportsCharts(apiBase, params);
  const trend = charts.revenueTrend || [];
  return { trend };
}

export async function fetchMonthlyRevenue(apiBase, params = {}) {
  // Reuse room revenue by date range and roll up by month if needed.
  const roomRevenue = await fetchRevenueByDateRange(apiBase, params);
  return { byDate: roomRevenue.revenueByDate || [] };
}

export async function fetchRoomRevenue(apiBase, params = {}) {
  const roomRevenue = await fetchRevenueByDateRange(apiBase, params);
  return roomRevenue;
}

export async function fetchRestaurantRevenue(apiBase, params = {}) {
  const restaurant = await fetchRestaurantSales(apiBase, params);
  return restaurant;
}

export async function fetchRevenueTrend(apiBase, params = {}) {
  const charts = await fetchReportsCharts(apiBase, params);
  return charts.revenueTrend || [];
}

export async function fetchRevenueComparison(apiBase, params = {}) {
  const trend = await fetchRevenueTrend(apiBase, params);
  if (!trend.length) return { current: null, previous: null };
  const current = trend[trend.length - 1];
  const previous = trend[trend.length - 2] || null;
  return { current, previous };
}

