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

export async function fetchSystemHealth() {
  const res = await fetch(`${API_BASE}/api/help-system/health`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load system health");
}

export async function fetchSupportTickets() {
  const res = await fetch(`${API_BASE}/api/help-system/support-tickets`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load support tickets summary");
}

export async function fetchBackupStatus() {
  const res = await fetch(`${API_BASE}/api/help-system/backup-status`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load backup status");
}

export async function fetchSystemUpdates() {
  const res = await fetch(`${API_BASE}/api/help-system/system-updates`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load system updates");
}

export async function fetchRecentActivity() {
  const res = await fetch(`${API_BASE}/api/help-system/recent-activity`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load recent activity");
}

export async function fetchUsageAnalytics() {
  const res = await fetch(`${API_BASE}/api/help-system/usage-analytics`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load usage analytics");
}

