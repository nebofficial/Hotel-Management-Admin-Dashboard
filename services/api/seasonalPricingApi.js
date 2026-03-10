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

export async function fetchSeasonalRules(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/seasonal-pricing${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load seasonal pricing rules');
}

export async function createSeasonRule(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/seasonal-pricing`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to create seasonal pricing rule');
}

export async function updateSeasonRule(apiBase, id, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/seasonal-pricing/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to update seasonal pricing rule');
}

export async function deleteSeasonRule(apiBase, id) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/seasonal-pricing/${id}`, {
    method: 'DELETE',
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to delete seasonal pricing rule');
}

export async function assignSeasonRuleToRoomType(apiBase, id, roomTypes) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/seasonal-pricing/${id}/assign-room-types`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ roomTypes }),
  });
  return handle(res, 'Failed to assign seasonal rule to room types');
}

