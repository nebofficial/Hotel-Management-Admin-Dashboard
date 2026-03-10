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

export async function fetchThemeSettings(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/theme-settings`,
    {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to load theme settings");
}

export async function updateThemeSettings(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/theme-settings`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to update theme settings");
}

export async function resetThemeDefaults(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/theme-settings/reset`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    }
  );
  return handle(res, "Failed to reset theme settings");
}

export async function uploadLogo(apiBase, hotelId, file) {
  if (!apiBase || !hotelId || !file) throw new Error("Missing params");
  const formData = new FormData();
  formData.append("logo", file);

  const headers = authHeaders();
  delete headers["Content-Type"];

  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/theme-settings/logo`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );
  return handle(res, "Failed to upload logo");
}

