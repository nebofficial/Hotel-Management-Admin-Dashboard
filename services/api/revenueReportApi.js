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
  if (!apiBase) {
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
  return handle(res, 'Failed to load total revenue');
}

export async function fetchRevenueByRooms(apiBase, params = {}) {
  if (!apiBase) return { revenueByRooms: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/by-rooms${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load room revenue');
}

export async function fetchRevenueByRestaurant(apiBase, params = {}) {
  if (!apiBase) return { totalOrders: 0, totalSales: 0, averageOrderValue: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/by-restaurant${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load restaurant revenue');
}

export async function fetchRevenueByServices(apiBase, params = {}) {
  if (!apiBase) return { services: [], totalServiceRevenue: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/by-services${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load services revenue');
}

export async function fetchDailyRevenue(apiBase, params = {}) {
  if (!apiBase) return { daily: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/daily${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load daily revenue');
}

export async function fetchMonthlyRevenue(apiBase, params = {}) {
  if (!apiBase) return { monthly: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/revenue-report/monthly${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load monthly revenue');
}

export async function fetchRevenueTrend(apiBase, params = {}) {
  if (!apiBase) return { trend: [], departmentRevenue: [] };
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

