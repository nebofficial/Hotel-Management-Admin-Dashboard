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

export async function fetchPromoCodes(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/promo-codes${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load promo codes');
}

export async function createPromoCode(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/promo-codes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to create promo code');
}

export async function updatePromoCode(apiBase, id, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/promo-codes/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to update promo code');
}

export async function togglePromoStatus(apiBase, id) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/promo-codes/${id}/toggle-status`, {
    method: 'POST',
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to toggle promo status');
}

export async function fetchPromoAnalytics(apiBase) {
  if (!apiBase) return { activePromoCodes: 0, totalDiscountGiven: 0, totalPromoBookings: 0, averageDiscountValue: 0, byCode: [] };
  const res = await fetch(`${apiBase}/promo-codes/analytics`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load promo analytics');
}

export async function validatePromoCode(apiBase, code, subtotal) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams({ code, subtotal: String(subtotal || 0) }).toString();
  const res = await fetch(`${apiBase}/promo-codes/validate?${qs}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to validate promo code');
}
