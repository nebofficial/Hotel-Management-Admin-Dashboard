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

export async function fetchIntegrations(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/integration-settings`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load integrations");
}

export async function connectIntegration(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/integration-settings/connect`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to connect integration");
}

export async function updateIntegration(apiBase, hotelId, id, payload) {
  if (!apiBase || !hotelId || !id) throw new Error("Missing params");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/integration-settings/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to update integration");
}

export async function disconnectIntegration(apiBase, hotelId, id) {
  if (!apiBase || !hotelId || !id) throw new Error("Missing params");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/integration-settings/${id}/disconnect`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to disconnect integration");
}

export async function testIntegration(apiBase, hotelId, id) {
  if (!apiBase || !hotelId || !id) throw new Error("Missing params");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/integration-settings/${id}/test`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to test integration");
}

