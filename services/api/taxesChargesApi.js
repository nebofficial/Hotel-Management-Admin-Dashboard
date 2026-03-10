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

export async function fetchTaxRules(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/taxes-charges/rules`,
    { headers: { "Content-Type": "application/json", ...authHeaders() } }
  );
  return handle(res, "Failed to load tax rules");
}

export async function createTaxRule(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/taxes-charges/rules`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to create tax rule");
}

export async function updateTaxRule(apiBase, hotelId, id, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/taxes-charges/rules/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to update tax rule");
}

export async function toggleTaxRuleStatus(apiBase, hotelId, id, active) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/taxes-charges/rules/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ active }),
    }
  );
  return handle(res, "Failed to update tax rule status");
}

export async function deleteTaxRule(apiBase, hotelId, id) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/taxes-charges/rules/${id}`,
    {
      method: "DELETE",
      headers: { ...authHeaders() },
    }
  );
  if (!res.ok && res.status !== 204) {
    return handle(res, "Failed to delete tax rule");
  }
  return { success: true };
}

