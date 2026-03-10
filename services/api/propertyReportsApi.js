const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

function makeBase(apiBase, hotelId) {
  const base = (apiBase || '').replace(/\/$/, '');
  return `${base}/api/hotel-data/${hotelId}`;
}

// We reuse existing single-property report APIs by pointing them at
// `${API_BASE}/api/hotel-data/:hotelId`

import {
  fetchOccupancySummary,
  fetchDailyOccupancy,
} from './occupancyReportApi';
import {
  fetchTotalRevenue as fetchHotelTotalRevenue,
} from './revenueReportApi';
import {
  fetchExpenseSummary,
} from './expenseReportApi';
import {
  fetchInventorySummary,
} from './inventoryReportApi';
import {
  fetchAttendancePerformance,
  fetchTaskCompletion,
  fetchSalesPerformance,
} from './staffPerformanceApi';
import {
  fetchRestaurantSalesSummary,
  fetchDailyRestaurantSales,
} from './restaurantSalesApi';

// Occupancy
export async function fetchOccupancyReport(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) return { totalRooms: 0, roomsOccupiedToday: 0, occupancyRateToday: 0, daily: [] };
  const base = makeBase(apiBase, hotelId);
  const [summary, daily] = await Promise.all([
    fetchOccupancySummary(base, params),
    fetchDailyOccupancy(base, params),
  ]);
  return {
    ...summary,
    daily: daily.daily || [],
  };
}

// Revenue
export async function fetchRevenueReport(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) {
    return {
      totalRevenueToday: 0,
      totalRevenueThisMonth: 0,
      totalRevenueThisYear: 0,
      averageDailyRevenue: 0,
    };
  }
  const base = makeBase(apiBase, hotelId);
  return fetchHotelTotalRevenue(base, params);
}

// Expenses
export async function fetchExpenseReport(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) {
    return { totalExpenses: 0, totalVendorPayments: 0, operationalCosts: 0, maintenanceExpenses: 0 };
  }
  const base = makeBase(apiBase, hotelId);
  return fetchExpenseSummary(base, params);
}

// Inventory
export async function fetchInventoryReport(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) {
    return { totalItems: 0, totalInventoryValue: 0, lowStockItems: 0, stockConsumedToday: 0 };
  }
  const base = makeBase(apiBase, hotelId);
  return fetchInventorySummary(base, params);
}

// Staff performance (simple aggregation of a few metrics)
export async function fetchStaffPerformanceReport(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) {
    return { attendance: [], tasks: [], sales: [] };
  }
  const base = makeBase(apiBase, hotelId);
  const [attendance, tasks, sales] = await Promise.all([
    fetchAttendancePerformance(base, params),
    fetchTaskCompletion(base, params),
    fetchSalesPerformance(base, params),
  ]);
  return {
    attendance: attendance.attendance || [],
    tasks: tasks.tasks || [],
    sales: sales.sales || [],
  };
}

// Restaurant sales
export async function fetchRestaurantSalesReport(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) {
    return { totalRestaurantRevenue: 0, totalOrders: 0, averageOrderValue: 0, daily: [] };
  }
  const base = makeBase(apiBase, hotelId);
  const [summary, daily] = await Promise.all([
    fetchRestaurantSalesSummary(base, params),
    fetchDailyRestaurantSales(base, params),
  ]);
  return {
    ...summary,
    daily: daily.daily || [],
  };
}

// Simple revenue export as a starting point for PDF/Excel
export async function exportPropertyReports(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) throw new Error('apiBase and hotelId required');
  const base = makeBase(apiBase, hotelId);
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/revenue-report/export${qs ? `?${qs}` : ''}`, {
    headers: headers(),
  });
  return handle(res, 'Failed to export property report');
}

