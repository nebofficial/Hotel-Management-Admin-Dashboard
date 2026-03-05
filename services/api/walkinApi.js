const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function generateWalkinNumber(apiBase) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/walkins/next-number`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to generate walk-in number')
  return data.walkinNumber
}

export async function getAvailableRooms(apiBase, params = {}) {
  if (!apiBase) return { availableRooms: [] }
  const qs = new URLSearchParams()
  if (params.roomType) qs.set('roomType', params.roomType)
  if (params.checkOut) qs.set('checkOut', params.checkOut)

  const res = await fetch(`${apiBase}/walkins/available-rooms?${qs.toString()}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to get available rooms')
  return data
}

export async function lookupGuest(apiBase, phone) {
  if (!apiBase || !phone) return { found: false, guest: null }
  const res = await fetch(`${apiBase}/walkins/lookup-guest?phone=${encodeURIComponent(phone)}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to lookup guest')
  return data
}

export async function calculateRate(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/walkins/calculate-rate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to calculate rate')
  return data
}

export async function createWalkin(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/walkins`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to create walk-in booking')
  return data
}

export async function listWalkins(apiBase, params = {}) {
  if (!apiBase) return { walkins: [], total: 0 }
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.dateFrom) qs.set('dateFrom', params.dateFrom)
  if (params.dateTo) qs.set('dateTo', params.dateTo)
  if (params.search) qs.set('search', params.search)
  if (params.page) qs.set('page', params.page)
  if (params.limit) qs.set('limit', params.limit)

  const res = await fetch(`${apiBase}/walkins?${qs.toString()}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to list walk-ins')
  return data
}

export async function getWalkin(apiBase, walkinId) {
  if (!apiBase || !walkinId) return null
  const res = await fetch(`${apiBase}/walkins/${walkinId}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to get walk-in')
  return data
}

export async function checkoutWalkin(apiBase, walkinId, payload = {}) {
  if (!apiBase || !walkinId) return null
  const res = await fetch(`${apiBase}/walkins/${walkinId}/checkout`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to checkout')
  return data
}

export async function cancelWalkin(apiBase, walkinId, reason = '') {
  if (!apiBase || !walkinId) return null
  const res = await fetch(`${apiBase}/walkins/${walkinId}/cancel`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ reason }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to cancel walk-in')
  return data
}

export async function generateBill(apiBase, walkinId) {
  if (!apiBase || !walkinId) return null
  const res = await fetch(`${apiBase}/walkins/${walkinId}/bill`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to generate bill')
  return data
}

export async function generateRegistrationCard(apiBase, walkinId) {
  if (!apiBase || !walkinId) return null
  const res = await fetch(`${apiBase}/walkins/${walkinId}/registration-card`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to generate registration card')
  return data
}

export async function fetchRoomTypes(apiBase) {
  if (!apiBase) return []
  const res = await fetch(`${apiBase}/rooms`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return []
  const rooms = data.rooms || []
  return [...new Set(rooms.map((r) => r.roomType).filter(Boolean))].sort()
}
