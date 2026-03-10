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

export async function fetchShifts(apiBase, params = {}) {
  if (!apiBase) return { shifts: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/shift-management/shifts${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load shifts');
}

export async function createShift(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/shifts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to create shift');
}

export async function updateShift(apiBase, shiftId, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/shifts/${shiftId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to update shift');
}

export async function deleteShift(apiBase, shiftId) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/shifts/${shiftId}`, {
    method: 'DELETE',
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to delete shift');
}

export async function fetchStaff(apiBase) {
  if (!apiBase) return { staff: [] };
  const res = await fetch(`${apiBase}/shift-management/staff`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load staff');
}

export async function assignShiftToStaff(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/assign`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to assign shift');
}

export async function fetchShiftSchedule(apiBase, params = {}) {
  if (!apiBase) return { days: [], shifts: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/shift-management/schedule${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load schedule');
}

export async function checkConflict(apiBase, params) {
  if (!apiBase) return { conflicts: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/shift-management/check-conflict${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to check conflict');
}

export async function requestShiftChange(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/change-requests`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handle(res, 'Failed to request shift change');
}

export async function fetchShiftChangeRequests(apiBase, params = {}) {
  if (!apiBase) return { requests: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/shift-management/change-requests${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load change requests');
}

export async function approveShiftChange(apiBase, requestId) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/change-requests/${requestId}/approve`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({}),
  });
  return handle(res, 'Failed to approve');
}

export async function rejectShiftChange(apiBase, requestId, reason) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/shift-management/change-requests/${requestId}/reject`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ reason }),
  });
  return handle(res, 'Failed to reject');
}

export async function exportShiftSchedule(apiBase, params = {}) {
  if (!apiBase) return { export: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/shift-management/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export');
}
