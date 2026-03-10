const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchLoginActivity(apiBase, params = {}) {
  if (!apiBase) return { logs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/audit-logs/login-activity${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load login activity');
}

export async function fetchSystemChanges(apiBase, params = {}) {
  if (!apiBase) return { logs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/audit-logs/system-changes${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load system changes');
}

export async function fetchDataModificationLogs(apiBase, params = {}) {
  if (!apiBase) return { logs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/audit-logs/data-modifications${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load data modification logs');
}

export async function fetchRolePermissionLogs(apiBase, params = {}) {
  if (!apiBase) return { logs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/audit-logs/role-permissions${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load role & permission logs');
}

export async function fetchTransactionLogs(apiBase, params = {}) {
  if (!apiBase) return { logs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/audit-logs/transactions${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load transaction logs');
}

export async function exportAuditLogs(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/audit-logs/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export audit logs');
}

