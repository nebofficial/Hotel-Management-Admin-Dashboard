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

export async function createTicket(payload) {
  const res = await fetch(`${API_BASE}/api/support-tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to create ticket");
}

export async function getTickets() {
  const res = await fetch(`${API_BASE}/api/support-tickets`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load tickets");
}

export async function getTicketById(id) {
  const res = await fetch(`${API_BASE}/api/support-tickets/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handle(res, "Failed to load ticket");
}

export async function updateTicketStatus(id, status) {
  const res = await fetch(`${API_BASE}/api/support-tickets/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  return handle(res, "Failed to update ticket status");
}

export async function addTicketComment(id, payload) {
  const res = await fetch(`${API_BASE}/api/support-tickets/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res, "Failed to add comment");
}

export async function uploadTicketAttachment(id, file) {
  const formData = new FormData();
  formData.append("attachment", file);
  const headers = authHeaders();
  delete headers["Content-Type"];
  const res = await fetch(`${API_BASE}/api/support-tickets/${id}/attachments`, {
    method: "POST",
    headers,
    body: formData,
  });
  return handle(res, "Failed to upload attachment");
}

export async function reopenOrCloseTicket(id, action) {
  const res = await fetch(
    `${API_BASE}/api/support-tickets/${id}/reopen-or-close`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ action }),
    },
  );
  return handle(res, "Failed to update ticket");
}

