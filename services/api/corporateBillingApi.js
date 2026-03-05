const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const baseUrl = () => `${getApiBaseUrl()}/api/hotel-data`;

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || data.error || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export async function createCorporateAccount(hotelId, payload) {
  const res = await fetch(`${baseUrl()}/${hotelId}/corporate-billing/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchCorporateAccounts(hotelId) {
  const res = await fetch(`${baseUrl()}/${hotelId}/corporate-billing/accounts`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function generateCorporateInvoice(hotelId, payload) {
  const res = await fetch(`${baseUrl()}/${hotelId}/corporate-billing/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function generateBulkInvoices(hotelId, payload) {
  const res = await fetch(`${baseUrl()}/${hotelId}/corporate-billing/invoices/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchOutstandingPayments(hotelId) {
  const res = await fetch(`${baseUrl()}/${hotelId}/corporate-billing/outstanding`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function downloadStatement(hotelId, accountId) {
  const url = new URL(`${baseUrl()}/${hotelId}/corporate-billing/statement`);
  if (accountId) url.searchParams.set('accountId', accountId);
  const res = await fetch(url.toString(), {
    credentials: 'include',
  });
  return handleResponse(res);
}

