const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchOccupancySummary(apiBase, params = {}) {
  if (!apiBase) return { totalRooms: 0, roomsOccupiedToday: 0, roomsAvailableToday: 0, occupancyRateToday: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/occupancy-report/summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load occupancy summary');
}

export async function fetchDailyOccupancy(apiBase, params = {}) {
  if (!apiBase) return { daily: [], totalRooms: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/occupancy-report/daily${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load daily occupancy');
}

export async function fetchWeeklyOccupancy(apiBase, params = {}) {
  if (!apiBase) return { weekly: [], totalRooms: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/occupancy-report/weekly${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load weekly occupancy');
}

export async function fetchMonthlyOccupancy(apiBase, params = {}) {
  if (!apiBase) return { monthly: [], totalRooms: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/occupancy-report/monthly${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load monthly occupancy');
}

export async function fetchRoomTypeOccupancy(apiBase, params = {}) {
  if (!apiBase) return { roomTypeOccupancy: [], periodDays: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/occupancy-report/room-type${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load room type occupancy');
}

export async function exportOccupancyReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/occupancy-report/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export occupancy report');
}
