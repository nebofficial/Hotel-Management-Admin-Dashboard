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

export async function fetchCurrencySettings(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/currency-language`,
    { headers: { "Content-Type": "application/json", ...authHeaders() } }
  );
  return handle(res, "Failed to load currency & language settings");
}

export async function updateCurrencySettings(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/currency-language`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to update settings");
}

export async function updateExchangeRates(apiBase, hotelId, exchangeRates) {
  return updateCurrencySettings(apiBase, hotelId, { exchangeRates });
}
export async function updateLanguageSettings(apiBase, hotelId, data) {
  return updateCurrencySettings(apiBase, hotelId, data);
}
export async function updateDateFormat(apiBase, hotelId, data) {
  return updateCurrencySettings(apiBase, hotelId, data);
}
export async function updateTimezone(apiBase, hotelId, data) {
  return updateCurrencySettings(apiBase, hotelId, data);
}
export async function updateNumberFormat(apiBase, hotelId, data) {
  return updateCurrencySettings(apiBase, hotelId, data);
}
