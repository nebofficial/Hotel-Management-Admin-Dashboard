const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || fallbackMsg)
  return data
}

export async function fetchRoles(apiBase) {
  if (!apiBase) return { roles: [] }
  const res = await fetch(`${apiBase}/roles-permissions/roles`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to load roles')
}

export async function createRole(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/roles-permissions/roles`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to create role')
}

export async function updateRole(apiBase, roleId, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/roles-permissions/roles/${roleId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to update role')
}

export async function assignPermissions(apiBase, roleId, matrix) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/roles-permissions/roles/${roleId}/permissions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ permissionsMatrix: matrix }),
  })
  return handle(res, 'Failed to assign permissions')
}

export async function assignRoleToStaff(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/roles-permissions/assign-role`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to assign role to staff')
}

export async function fetchPermissionLogs(apiBase) {
  if (!apiBase) return { logs: [] }
  const res = await fetch(`${apiBase}/roles-permissions/logs`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to load permission logs')
}

export async function exportRolesReport(apiBase) {
  if (!apiBase) return { roles: [] }
  const res = await fetch(`${apiBase}/roles-permissions/export`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to export roles report')
}

