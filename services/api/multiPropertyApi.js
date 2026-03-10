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

function buildUrl(apiBase, path, params = {}) {
  const base = (apiBase || '').replace(/\/$/, '');
  const url = `${base}/api/multi-property/${path}`;
  const qs = new URLSearchParams(params).toString();
  return qs ? `${url}?${qs}` : url;
}

export async function fetchPropertyStats(apiBase) {
  if (!apiBase) {
    return {
      totalProperties: 0,
      totalRooms: 0,
      totalActiveBookings: 0,
      overallOccupancyRate: 0,
      totalRevenueToday: 0,
    };
  }
  const res = await fetch(buildUrl(apiBase, 'stats'), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load property stats');
}

export async function fetchOccupancyAcrossProperties(apiBase) {
  if (!apiBase) return { properties: [] };
  const res = await fetch(buildUrl(apiBase, 'occupancy'), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load occupancy');
}

export async function fetchTotalRevenue(apiBase, params = {}) {
  if (!apiBase) {
    return {
      totalRevenue: 0,
      revenueToday: 0,
      averageRevenuePerProperty: 0,
      byProperty: [],
    };
  }
  const res = await fetch(buildUrl(apiBase, 'revenue', params), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load total revenue');
}

export async function fetchPropertyComparison(apiBase, params = {}) {
  if (!apiBase) return { properties: [] };
  const res = await fetch(buildUrl(apiBase, 'comparison', params), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load property comparison');
}

export async function fetchRevenueDistribution(apiBase, params = {}) {
  if (!apiBase) return { byProperty: [], totalRevenue: 0 };
  const res = await fetch(buildUrl(apiBase, 'revenue-distribution', params), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load revenue distribution');
}

export async function fetchRecentPropertyActivity(apiBase, params = {}) {
  if (!apiBase) return { activities: [] };
  const res = await fetch(buildUrl(apiBase, 'recent-activity', params), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load recent activity');
}

export async function fetchPropertiesList(apiBase) {
  if (!apiBase) return { properties: [] };
  const res = await fetch(buildUrl(apiBase, 'properties'), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load properties list');
}

export async function fetchTotalBookings(apiBase, params = {}) {
  if (!apiBase) return { totalBookings: 0, byProperty: [] };
  const res = await fetch(buildUrl(apiBase, 'total-bookings', params), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load total bookings');
}

export async function fetchMonthlyTrends(apiBase, params = {}) {
  if (!apiBase) return { trends: [] };
  const res = await fetch(buildUrl(apiBase, 'monthly-trends', params), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load monthly trends');
}
