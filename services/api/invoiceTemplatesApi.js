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

export async function fetchInvoiceTemplates(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/invoice-templates`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load invoice templates");
}

export async function createInvoiceTemplate(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/invoice-templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to create invoice template");
}

export async function updateInvoiceTemplate(apiBase, hotelId, id, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/invoice-templates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to update invoice template");
}

export async function deleteInvoiceTemplate(apiBase, hotelId, id) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/invoice-templates/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (res.status === 204) return { success: true };
  return handle(res, "Failed to delete invoice template");
}

export async function previewInvoiceTemplate(apiBase, hotelId, id, sample = {}) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/invoice-templates/${id}/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(sample),
  });
  return handle(res, "Failed to generate invoice preview");
}

