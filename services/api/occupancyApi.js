const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

function hotelBase(hotelId) {
  if (!hotelId) return null;
  return `${API_BASE}/api/hotel-data/${hotelId}`;
}

export async function fetchOccupancySummary(hotelId, params = {}) {
  const base = hotelBase(hotelId);
  if (!base) {
    return {
      totalRooms: 0,
      roomsOccupiedToday: 0,
      roomsAvailableToday: 0,
      occupancyRateToday: 0,
      date: new Date().toISOString().slice(0, 10),
    };
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/occupancy-report/summary${qs ? `?${qs}` : ""}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load occupancy summary");
}

export async function fetchDailyOccupancy(hotelId, params = {}) {
  const base = hotelBase(hotelId);
  if (!base) return { daily: [], totalRooms: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/occupancy-report/daily${qs ? `?${qs}` : ""}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load daily occupancy");
}

export async function fetchWeeklyOccupancy(hotelId, params = {}) {
  const base = hotelBase(hotelId);
  if (!base) return { weekly: [], totalRooms: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/occupancy-report/weekly${qs ? `?${qs}` : ""}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load weekly occupancy");
}

export async function fetchMonthlyOccupancy(hotelId, params = {}) {
  const base = hotelBase(hotelId);
  if (!base) return { monthly: [], totalRooms: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/occupancy-report/monthly${qs ? `?${qs}` : ""}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load monthly occupancy");
}

export async function fetchRoomTypeOccupancy(hotelId, params = {}) {
  const base = hotelBase(hotelId);
  if (!base) return { roomTypeOccupancy: [], periodDays: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/occupancy-report/room-type${qs ? `?${qs}` : ""}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load room type occupancy");
}

export async function fetchOccupancyComparison(hotelId, params = {}) {
  // For now, reuse weekly occupancy and compute comparison between
  // the latest and previous periods on the client.
  const weekly = await fetchWeeklyOccupancy(hotelId, params);
  const rows = weekly.weekly || [];
  if (rows.length < 2) {
    return { current: null, previous: null };
  }
  const current = rows[rows.length - 1];
  const previous = rows[rows.length - 2];
  return { current, previous };
}

export async function fetchOccupancyForecast(hotelId, params = {}) {
  // Simple stub forecast based on recent weekly occupancy:
  // use the average of the last few weeks as a flat forecast.
  const weekly = await fetchWeeklyOccupancy(hotelId, params);
  const rows = weekly.weekly || [];
  if (!rows.length) return { forecast: [] };

  const recent = rows.slice(-4); // up to last 4 weeks
  const avg =
    recent.reduce((sum, w) => sum + (w.averageOccupancyRate || 0), 0) /
    recent.length;

  const forecast = Array.from({ length: 4 }).map((_, i) => ({
    label: `Week +${i + 1}`,
    expectedOccupancyRate: avg,
  }));

  return { forecast };
}

