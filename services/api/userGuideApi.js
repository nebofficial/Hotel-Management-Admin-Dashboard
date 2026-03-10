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

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export async function fetchGuides() {
  const res = await fetch(`${API_BASE}/api/user-guide/guides`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load guides");
}

export async function fetchTutorials() {
  const res = await fetch(`${API_BASE}/api/user-guide/tutorials`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load tutorials");
}

export async function fetchFAQs() {
  const res = await fetch(`${API_BASE}/api/user-guide/faqs`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load FAQs");
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/api/user-guide/documents`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load documentation list");
}

export async function searchHelpTopics(query) {
  const q = encodeURIComponent(query || "");
  const res = await fetch(`${API_BASE}/api/user-guide/search?q=${q}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to search help topics");
}

export async function downloadDocumentation(id) {
  const res = await fetch(`${API_BASE}/api/user-guide/download/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to fetch document download link");
}

