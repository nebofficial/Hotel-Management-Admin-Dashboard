const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchIntegrationSummary(apiBase) {
  if (!apiBase) return { activeIntegrations: 0, totalUsers: 0, activeUsers: 0, activeSessions: 0, systemStatus: 'Unknown' };
  const res = await fetch(`${apiBase}/api/settings-dashboard/overview`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load settings overview');
}

export async function fetchUserStats(apiBase) {
  // For now, this is included in overview, so just reuse
  return fetchIntegrationSummary(apiBase);
}

export async function fetchSystemHealth(apiBase) {
  if (!apiBase) return { cpuLoad: 0, totalMem: 0, freeMem: 0, usedMem: 0, uptimeSeconds: 0 };
  const res = await fetch(`${apiBase}/api/settings-dashboard/health`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load system health');
}

export async function fetchRecentConfigActivity(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/api/settings-dashboard/recent-config${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load config activity');
}

// Stubs for future expansion
export async function fetchBackupStatus() {
  return { lastBackup: null, status: 'Unknown', nextBackup: null };
}

export async function fetchApiUsage() {
  return { requestsToday: 0, topEndpoints: [], dailyTrend: [] };
}

export async function fetchDatabaseSize() {
  return { sizeMb: 0, growth: [] };
}

export async function fetchActiveSessions() {
  return { count: 0, sessions: [] };
}

