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

// apiBase is e.g. http://localhost:5000

export async function fetchUsers(apiBase) {
  if (!apiBase) return { users: [] };
  const res = await fetch(`${apiBase}/api/users`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load users');
}

export async function assignUserToProperty(apiBase, userId, hotelId) {
  if (!apiBase || !userId) throw new Error('apiBase and userId required');
  const res = await fetch(`${apiBase}/api/users/${userId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ hotelId }),
  });
  return handle(res, 'Failed to assign property');
}

export async function updateUserRole(apiBase, userId, roleId) {
  if (!apiBase || !userId) throw new Error('apiBase and userId required');
  const res = await fetch(`${apiBase}/api/users/${userId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ roleId }),
  });
  return handle(res, 'Failed to update role');
}

export async function updateUserPermissions(apiBase, userId, permissions) {
  if (!apiBase || !userId) throw new Error('apiBase and userId required');
  const res = await fetch(`${apiBase}/api/users/${userId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ permissions }),
  });
  return handle(res, 'Failed to update permissions');
}

export async function fetchUserActivityByProperty(apiBase, hotelId, params = {}) {
  if (!apiBase || !hotelId) return { logs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/audit-logs/system-changes${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load user activity');
}

// Cross-property restriction is essentially managed by hotelId + permissions
export async function restrictCrossPropertyAccess(apiBase, userId, hotelId, permissions) {
  if (!apiBase || !userId) throw new Error('apiBase and userId required');
  const res = await fetch(`${apiBase}/api/users/${userId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ hotelId, permissions }),
  });
  return handle(res, 'Failed to restrict access');
}

