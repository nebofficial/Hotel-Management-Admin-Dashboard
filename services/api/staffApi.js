const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || fallbackMsg)
  return data
}

export async function fetchStaffMembers(apiBase, params = {}) {
  if (!apiBase) return { staff: [] }
  const qs = new URLSearchParams()
  if (params.includeInactive === true) qs.set('includeInactive', 'true')
  const url = `${apiBase}/staff-members${qs.toString() ? `?${qs}` : ''}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  })
  return handle(res, 'Failed to load staff members')
}

export async function createStaffMember(apiBase, payload) {
  if (!apiBase) throw new Error('API base required')
  const res = await fetch(`${apiBase}/staff-members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to create staff member')
}

export async function updateStaffMember(apiBase, id, payload) {
  if (!apiBase) throw new Error('API base required')
  const res = await fetch(`${apiBase}/staff-members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to update staff member')
}

export async function deleteStaffMember(apiBase, id) {
  if (!apiBase) throw new Error('API base required')
  const res = await fetch(`${apiBase}/staff-members/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handle(res, 'Failed to delete staff member')
}
