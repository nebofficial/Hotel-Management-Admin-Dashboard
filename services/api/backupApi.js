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

export async function createBackup(scope) {
  const res = await fetch(`${API_BASE}/api/backup/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ scope }),
  });
  return handle(res, "Failed to create backup");
}

export async function scheduleBackup(config) {
  const res = await fetch(`${API_BASE}/api/backup/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(config),
  });
  return handle(res, "Failed to schedule backup");
}

export async function fetchBackupHistory() {
  const res = await fetch(`${API_BASE}/api/backup/history`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load backup history");
}

export async function downloadBackup(id) {
  const res = await fetch(`${API_BASE}/api/backup/download/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to get backup download link");
}

export async function restoreBackup(id) {
  const res = await fetch(`${API_BASE}/api/backup/restore/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to restore from backup");
}

export async function verifyBackup(id) {
  const res = await fetch(`${API_BASE}/api/backup/verify/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to verify backup");
}

