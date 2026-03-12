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

export async function checkForUpdates() {
  const res = await fetch(`${API_BASE}/api/system-updates/check`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to check for updates");
}

export async function installUpdate(id) {
  const res = await fetch(`${API_BASE}/api/system-updates/install`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ id }),
  });
  return handle(res, "Failed to install update");
}

export async function fetchUpdateHistory() {
  const res = await fetch(`${API_BASE}/api/system-updates/history`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load update history");
}

export async function applySecurityPatch(id) {
  const res = await fetch(`${API_BASE}/api/system-updates/patch`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ id }),
  });
  return handle(res, "Failed to apply security patch");
}

export async function restartSystem(payload) {
  const res = await fetch(`${API_BASE}/api/system-updates/restart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload || {}),
  });
  return handle(res, "Failed to trigger restart");
}

