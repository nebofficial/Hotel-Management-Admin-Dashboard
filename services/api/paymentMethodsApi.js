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

export async function fetchPaymentMethods(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/payment-methods`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load payment methods");
}

export async function createPaymentMethod(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/payment-methods`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to create payment method");
}

export async function updatePaymentMethod(apiBase, hotelId, id, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/payment-methods/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to update payment method");
}

export async function togglePaymentMethodStatus(apiBase, hotelId, id, active) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/payment-methods/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ active }),
    }
  );
  return handle(res, "Failed to update payment method status");
}

export async function configurePaymentGateway(apiBase, hotelId, id, config) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/payment-methods/${id}/gateway`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(config),
  });
  return handle(res, "Failed to configure payment gateway");
}

export async function fetchTransactionLogs(apiBase, hotelId, query = {}) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.methodId) params.set("methodId", query.methodId);
  if (query.startDate) params.set("startDate", query.startDate);
  if (query.endDate) params.set("endDate", query.endDate);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/payment-methods/transactions?${params.toString()}`,
    { headers: { "Content-Type": "application/json", ...authHeaders() } }
  );
  return handle(res, "Failed to load payment transactions");
}

export async function updatePaymentConfirmationSettings(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/payment-methods/confirmation-settings`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to update confirmation settings");
}

