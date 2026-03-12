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

export async function fetchOverviewSummary(hotelId, params) {
  const search = new URLSearchParams(params || {}).toString();
  const qs = search ? `?${search}` : "";
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/overview-kpis/kpis${qs}`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load overview KPIs");
}

export async function fetchRevenueTrend(hotelId, params) {
  const search = new URLSearchParams(params || {}).toString();
  const qs = search ? `?${search}` : "";
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/overview-kpis/revenue-trend${qs}`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load revenue trend");
}

export async function fetchOccupancyTrend(hotelId, params) {
  const search = new URLSearchParams(params || {}).toString();
  const qs = search ? `?${search}` : "";
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/overview-kpis/occupancy-trend${qs}`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load occupancy trend");
}

// Convenience wrappers mapped to the folder-structure spec

export async function fetchRevenueKPI(hotelId, params) {
  const data = await fetchOverviewSummary(hotelId, params);
  return data.revenueKpi;
}

export async function fetchOccupancyRate(hotelId, params) {
  const data = await fetchOverviewSummary(hotelId, params);
  return data.occupancyKpi;
}

export async function fetchAvailableRooms(hotelId, params) {
  const data = await fetchOverviewSummary(hotelId, params);
  return data.availableRoomsKpi;
}

export async function fetchCheckinsToday(hotelId, params) {
  const data = await fetchOverviewSummary(hotelId, params);
  return data.checkinsTodayKpi;
}

