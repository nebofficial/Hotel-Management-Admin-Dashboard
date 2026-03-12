const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchRevenueSummary(apiBase, params = {}) {
  // If we don't have an API base or auth token yet, return
  // a safe default summary instead of throwing errors.
  if (!apiBase || !getToken()) {
    return {
      totalRevenue: 0,
      roomRevenue: 0,
      restaurantRevenue: 0,
      otherServicesRevenue: 0,
      currency: 'INR',
      byDate: [],
      bySource: [],
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/reports-dashboard/revenue-summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load revenue summary');
}

export async function fetchOccupancyStats(apiBase, params = {}) {
  if (!apiBase || !getToken()) {
    return {
      totalRooms: 0,
      roomsOccupiedToday: 0,
      roomsAvailableToday: 0,
      occupancyRateToday: 0,
      trend: [],
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/reports-dashboard/occupancy-stats${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load occupancy stats');
}

export async function fetchRestaurantSales(apiBase, params = {}) {
  if (!apiBase || !getToken()) {
    return {
      totalSales: 0,
      ordersCount: 0,
      avgOrderValue: 0,
      topItems: [],
      byDay: [],
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/reports-dashboard/restaurant-sales${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load restaurant sales');
}

export async function fetchExpenseSummary(apiBase, params = {}) {
  if (!apiBase || !getToken()) {
    return {
      totalExpenses: 0,
      operationalCosts: 0,
      maintenanceCosts: 0,
      byCategory: [],
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/reports-dashboard/expense-summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load expense summary');
}

export async function fetchReportsCharts(apiBase, params = {}) {
  if (!apiBase || !getToken()) {
    return {
      revenueTrend: [],
      occupancyTrend: [],
      salesBreakdown: [],
      recentReports: [],
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/reports-dashboard/charts${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });

  // Be forgiving for charts: if this endpoint fails, return an empty
  // structure instead of throwing, so the rest of the dashboard keeps working.
  let data = {};
  try {
    data = await res.json().catch(() => ({}));
  } catch {
    // ignore JSON parse errors and fall back to defaults
  }

  if (!res.ok) {
    console.warn('Failed to load dashboard charts', data);
    return {
      revenueTrend: [],
      occupancyTrend: [],
      salesBreakdown: [],
      recentReports: [],
    };
  }

  return data;
}

export async function exportDashboardReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/reports-dashboard/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export dashboard report');
}

