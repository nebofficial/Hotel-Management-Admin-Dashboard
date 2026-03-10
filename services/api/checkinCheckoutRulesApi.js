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

export async function fetchRules(apiBase, hotelId) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/checkin-checkout-rules`,
    { headers: { "Content-Type": "application/json", ...authHeaders() } }
  );
  return handle(res, "Failed to load check-in/check-out rules");
}

export async function updateRules(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) throw new Error("Missing API base or hotelId");
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/checkin-checkout-rules`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  return handle(res, "Failed to update rules");
}

export async function updateStandardTimes(apiBase, hotelId, data) {
  return updateRules(apiBase, hotelId, data);
}
export async function updateEarlyCheckinPolicy(apiBase, hotelId, data) {
  return updateRules(apiBase, hotelId, data);
}
export async function updateLateCheckoutPolicy(apiBase, hotelId, data) {
  return updateRules(apiBase, hotelId, data);
}
export async function updateGracePeriod(apiBase, hotelId, data) {
  return updateRules(apiBase, hotelId, data);
}
export async function updateAutoCheckoutSettings(apiBase, hotelId, data) {
  return updateRules(apiBase, hotelId, data);
}
