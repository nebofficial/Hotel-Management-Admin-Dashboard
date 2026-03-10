const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchRoomRevenueSummary(apiBase, params = {}) {
  if (!apiBase) return { totalRoomRevenue: 0, adr: 0, revpar: 0, totalBookings: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/room-revenue/summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load room revenue summary');
}

export async function fetchRevenueByRoomType(apiBase, params = {}) {
  if (!apiBase) return { revenueByRoomType: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/room-revenue/by-room-type${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load revenue by room type');
}

export async function fetchRevenueByDateRange(apiBase, params = {}) {
  if (!apiBase) return { revenueByDate: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/room-revenue/by-date-range${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load revenue by date range');
}

export async function fetchRevenueTrend(apiBase, params = {}) {
  if (!apiBase) return { trend: [], roomTypeRevenue: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/room-revenue/trend${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load revenue trend');
}

export async function fetchRoomRevenueDetails(apiBase, params = {}) {
  if (!apiBase) return { details: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/room-revenue/details${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load room revenue details');
}

export async function exportRoomRevenueReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/room-revenue/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export room revenue report');
}
