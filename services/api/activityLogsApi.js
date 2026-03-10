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

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchActivityLogs(filters = {}) {
  const qs = buildQuery(filters);
  const res = await fetch(`${API_BASE}/api/activity-logs${qs}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load activity logs");
}

export async function fetchLoginLogs(filters = {}) {
  const qs = buildQuery(filters);
  const res = await fetch(`${API_BASE}/api/activity-logs/logins${qs}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load login logs");
}

export async function fetchErrorLogs(filters = {}) {
  const qs = buildQuery(filters);
  const res = await fetch(`${API_BASE}/api/activity-logs/errors${qs}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load error logs");
}

export async function filterLogs(filters = {}) {
  return fetchActivityLogs(filters);
}

export async function exportLogs(filters = {}, format = "csv") {
  const qs = buildQuery({ ...filters, format });
  const res = await fetch(`${API_BASE}/api/activity-logs/export${qs}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to export logs");
}

