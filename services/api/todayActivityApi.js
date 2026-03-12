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

export async function fetchTodayCheckins(hotelId, params) {
  const search = new URLSearchParams(params || {}).toString();
  const qs = search ? `?${search}` : "";
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/today-activity/checkins${qs}`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load today's check-ins");
}

export async function fetchTodayCheckouts(hotelId, params) {
  const search = new URLSearchParams(params || {}).toString();
  const qs = search ? `?${search}` : "";
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/today-activity/checkouts${qs}`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load today's check-outs");
}

export async function processQuickCheckin(hotelId, id) {
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/today-activity/checkins/${id}/quick`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to process quick check-in");
}

export async function processQuickCheckout(hotelId, id) {
  const res = await fetch(
    `${API_BASE}/api/hotel-data/${hotelId}/today-activity/checkouts/${id}/quick`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to process quick check-out");
}

