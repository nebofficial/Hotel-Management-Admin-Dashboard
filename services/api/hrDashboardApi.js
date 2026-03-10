const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchStaffSummary(apiBase) {
  if (!apiBase) return { summary: null };
  const res = await fetch(`${apiBase}/hr-dashboard/staff-summary`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res, 'Failed to load staff summary');
}

export async function fetchDutyStatus(apiBase) {
  if (!apiBase) return { list: [] };
  const res = await fetch(`${apiBase}/hr-dashboard/duty-status`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res, 'Failed to load duty status');
}

export async function fetchLeaveRequests(apiBase) {
  if (!apiBase) return { pending: [] };
  const res = await fetch(`${apiBase}/hr-dashboard/leave-requests`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res, 'Failed to load leave requests');
}

export async function fetchAttendanceStats(apiBase) {
  if (!apiBase) return { today: null, trend: [] };
  const res = await fetch(`${apiBase}/hr-dashboard/attendance`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res, 'Failed to load attendance stats');
}

export async function fetchStaffDistribution(apiBase) {
  if (!apiBase) return { departments: [] };
  const res = await fetch(`${apiBase}/hr-dashboard/distribution`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res, 'Failed to load staff distribution');
}

