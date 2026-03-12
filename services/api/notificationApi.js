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
  return `${API_BASE}/api/hotel-data/${hotelId}/notifications`;
}

export async function fetchNotifications(hotelId) {
  const base = hotelBase(hotelId);
  if (!base) return { items: [] };
  const res = await fetch(base, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load notifications");
}

export async function markNotificationRead(hotelId, id) {
  const base = hotelBase(hotelId);
  if (!base) return { item: null };
  const res = await fetch(`${base}/${id}/read`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to mark notification as read");
}

export async function fetchLowAvailabilityAlerts(hotelId) {
  const base = hotelBase(hotelId);
  if (!base) return { items: [] };
  const res = await fetch(`${base}/low-availability`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load low availability alerts");
}

export async function fetchPaymentAlerts(hotelId) {
  const base = hotelBase(hotelId);
  if (!base) return { items: [] };
  const res = await fetch(`${base}/payments`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load payment alerts");
}

export async function fetchMaintenanceAlerts(hotelId) {
  const base = hotelBase(hotelId);
  if (!base) return { items: [] };
  const res = await fetch(`${base}/maintenance`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load maintenance alerts");
}

