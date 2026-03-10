const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchCommissionRules(apiBase) {
  if (!apiBase) return { rules: [] };
  const res = await fetch(`${apiBase}/commission/rules`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load commission rules');
}

export async function createCommissionRule(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/commission/rules`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to create commission rule');
}

export async function assignCommissionToStaff(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/commission/assign-staff`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to assign commission');
}

export async function calculateCommission(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/commission/calculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to calculate commission');
}

export async function fetchCommissionList(apiBase, params = {}) {
  if (!apiBase) return { list: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/commission/list${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load commission list');
}

export async function fetchCommissionReports(apiBase, params = {}) {
  if (!apiBase) return { summary: {}, byStaff: [], byDepartment: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/commission/reports${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load commission reports');
}

export async function updateCommissionPayout(apiBase, id, payload = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/commission/transactions/${id}/payout`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to update payout');
}

