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

function buildUrl(apiBase, path = '') {
  const base = (apiBase || '').replace(/\/$/, '');
  return `${base}/api/hotels${path ? `/${path}` : ''}`;
}

export async function fetchProperties(apiBase) {
  if (!apiBase) return { hotels: [] };
  const res = await fetch(buildUrl(apiBase), { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load properties');
}

export async function fetchProperty(apiBase, id) {
  if (!apiBase || !id) throw new Error('apiBase and id required');
  const res = await fetch(buildUrl(apiBase, id), { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load property');
}

export async function fetchPropertyProfile(apiBase, id) {
  if (!apiBase || !id) throw new Error('apiBase and id required');
  const res = await fetch(buildUrl(apiBase, `${id}/profile`), {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load property profile');
}

export async function createProperty(apiBase, data) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(buildUrl(apiBase), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return handle(res, 'Failed to create property');
}

export async function updateProperty(apiBase, id, data) {
  if (!apiBase || !id) throw new Error('apiBase and id required');
  const res = await fetch(buildUrl(apiBase, id), {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return handle(res, 'Failed to update property');
}

export async function deleteProperty(apiBase, id) {
  if (!apiBase || !id) throw new Error('apiBase and id required');
  const res = await fetch(buildUrl(apiBase, id), { method: 'DELETE', headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to delete property');
}

export async function updatePropertyStatus(apiBase, id, isActive) {
  if (!apiBase || !id) throw new Error('apiBase and id required');
  const res = await fetch(buildUrl(apiBase, `${id}/status`), {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ isActive }),
  });
  return handle(res, 'Failed to update status');
}

export async function fetchUsers(apiBase) {
  if (!apiBase) return { users: [] };
  const base = (apiBase || '').replace(/\/$/, '');
  const res = await fetch(`${base}/api/users`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load users');
}

export async function assignPropertyManager(apiBase, propertyId, userId) {
  if (!apiBase || !propertyId || !userId) throw new Error('apiBase, propertyId and userId required');
  const res = await fetch(buildUrl(apiBase, `${propertyId}/assign-manager`), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ userId }),
  });
  return handle(res, 'Failed to assign manager');
}
