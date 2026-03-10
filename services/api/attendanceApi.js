const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function markAttendance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/attendance/mark`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to mark attendance');
}

export async function fetchAttendanceList(apiBase, params = {}) {
  if (!apiBase) return { list: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/attendance/list${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load attendance list');
}

export async function fetchDailyAttendance(apiBase, params = {}) {
  if (!apiBase) return { list: [], summary: null };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/attendance/daily${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load attendance');
}

export async function fetchAttendanceCalendar(apiBase, params = {}) {
  if (!apiBase) return { days: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/attendance/calendar${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load attendance calendar');
}

export async function generateAttendanceReport(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/attendance/report`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to generate attendance report');
}

export async function exportAttendance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/attendance/export`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to export attendance');
}

