const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchTotalRevenue(apiBase, params = {}) {
  // If we don't yet have a base URL or auth token (e.g. user not logged in),
  // return safe defaults instead of hitting the backend.
  if (!apiBase || !getToken()) {
    return {
      totalRevenueToday: 0,
      totalRevenueThisMonth: 0,
      totalRevenueThisYear: 0,
      averageDailyRevenue: 0,
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/total${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );

  // Be forgiving here: if this endpoint fails for any reason,
  // log a soft warning and return zeros so the report UI
  // continues working without noisy console errors.
  let data = {};
  try {
    data = await res.json().catch(() => ({}));
  } catch {
    // ignore JSON parse issues and fall back to defaults
  }
  if (!res.ok) {
    console.warn('Failed to load total revenue', data);
    return {
      totalRevenueToday: 0,
      totalRevenueThisMonth: 0,
      totalRevenueThisYear: 0,
      averageDailyRevenue: 0,
    };
  }
  return data;
}

export async function fetchRevenueByRooms(apiBase, params = {}) {
  if (!apiBase || !getToken()) return { revenueByRooms: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/by-rooms${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load room revenue');
}

export async function fetchRevenueByRestaurant(apiBase, params = {}) {
  if (!apiBase || !getToken()) return { totalOrders: 0, totalSales: 0, averageOrderValue: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/by-restaurant${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load restaurant revenue');
}

export async function fetchRevenueByServices(apiBase, params = {}) {
  if (!apiBase || !getToken()) return { services: [], totalServiceRevenue: 0 };

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/by-services${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );

  // Graceful handling: avoid throwing on backend errors, return defaults instead.
  let data = {};
  try {
    data = await res.json().catch(() => ({}));
  } catch {
    // ignore parse errors
  }

  if (!res.ok) {
    console.warn('Failed to load services revenue', data);
    return { services: [], totalServiceRevenue: 0 };
  }

  return data;
}

export async function fetchDailyRevenue(apiBase, params = {}) {
  if (!apiBase || !getToken()) return { daily: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/daily${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load daily revenue');
}

export async function fetchMonthlyRevenue(apiBase, params = {}) {
  if (!apiBase || !getToken()) return { monthly: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/monthly${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load monthly revenue');
}

export async function fetchRevenueTrend(apiBase, params = {}) {
  if (!apiBase || !getToken()) return { trend: [], departmentRevenue: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/trend${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load revenue trend');
}

export async function exportRevenueReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/export${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to export revenue report');
}

