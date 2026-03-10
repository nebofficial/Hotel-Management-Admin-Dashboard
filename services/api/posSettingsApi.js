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

export async function fetchPOSSettings(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/pos-settings`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load POS settings");
}

export async function updatePOSSettings(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(`${apiBase}/api/hotel-data/${hotelId}/pos-settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to update POS settings");
}

