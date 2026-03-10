const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || fallbackMsg);
  }
  return data;
}

export async function fetchHotelProfile(apiBase, hotelId) {
  if (!apiBase || !hotelId) {
    throw new Error("Missing API base URL or hotelId");
  }
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/profile`,
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    },
  );
  return handle(res, "Failed to load hotel profile");
}

export async function updateHotelProfile(apiBase, hotelId, payload) {
  if (!apiBase || !hotelId) {
    throw new Error("Missing API base URL or hotelId");
  }
  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );
  return handle(res, "Failed to update hotel profile");
}

export async function uploadHotelLogo(apiBase, hotelId, file) {
  if (!apiBase || !hotelId || !file) {
    throw new Error("Missing API base URL, hotelId, or file");
  }

  const formData = new FormData();
  formData.append("logo", file);

  const res = await fetch(
    `${apiBase}/api/hotel-data/${hotelId}/profile/logo`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
      body: formData,
    },
  );
  return handle(res, "Failed to upload hotel logo");
}

export async function updateOperationalHours(apiBase, hotelId, hours) {
  return updateHotelProfile(apiBase, hotelId, hours);
}

