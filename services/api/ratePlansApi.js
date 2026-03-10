const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchRatePlans(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/rate-plans${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load rate plans');
}

export async function createRatePlan(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/rate-plans`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to create rate plan');
}

export async function updateRatePlan(apiBase, id, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/rate-plans/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to update rate plan');
}

export async function assignRatePlanToRoomType(apiBase, id, roomTypes) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/rate-plans/${id}/assign-room-types`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ roomTypes }),
  });
  return handle(res, 'Failed to assign room types');
}

export async function toggleRatePlanStatus(apiBase, id) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/rate-plans/${id}/toggle-status`, {
    method: 'POST',
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to toggle rate plan status');
}

export async function exportRatePlans(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/rate-plans/export${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to export rate plans');
}

