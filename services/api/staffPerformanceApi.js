const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchAttendancePerformance(apiBase, params = {}) {
  if (!apiBase) return { attendance: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/staff-performance/attendance${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load attendance performance');
}

export async function fetchTaskCompletion(apiBase, params = {}) {
  if (!apiBase) return { tasks: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/staff-performance/tasks${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load task completion');
}

export async function fetchSalesPerformance(apiBase, params = {}) {
  if (!apiBase) return { sales: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/staff-performance/sales${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load sales performance');
}

export async function fetchCommissionPerformance(apiBase, params = {}) {
  if (!apiBase) return { commissions: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/staff-performance/commissions${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load commission performance');
}

export async function fetchDepartmentPerformance(apiBase, params = {}) {
  if (!apiBase) return { departments: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/staff-performance/departments${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load department performance');
}

export async function exportStaffPerformanceReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/staff-performance/export${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to export staff performance report');
}

