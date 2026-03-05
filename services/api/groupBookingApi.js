const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function generateMasterGroupId(apiBase) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/group-bookings/next-id`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to generate master group ID')
  return data.masterGroupId
}

export async function blockRooms(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/group-bookings/block-rooms`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to validate room blocks')
  return data
}

export async function applyGroupDiscount(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/group-bookings/apply-discount`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to calculate group pricing')
  return data
}

export async function createGroupBooking(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/group-bookings`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      data.error ||
      data.message ||
      (Array.isArray(data.errors) && data.errors[0]?.msg) ||
      (data.issues?.length && `Room inventory: ${data.issues.map((i) => `${i.roomType}: need ${i.requested}, available ${i.available}`).join('; ')}`) ||
      'Failed to create group booking'
    throw new Error(typeof msg === 'string' ? msg : 'Failed to create group booking')
  }
  return data
}

export async function getAllGroupBookings(apiBase, params = {}) {
  if (!apiBase) return { groups: [] }
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.checkInFrom) qs.set('checkInFrom', params.checkInFrom)
  if (params.checkInTo) qs.set('checkInTo', params.checkInTo)
  if (params.search) qs.set('search', params.search)

  const res = await fetch(`${apiBase}/group-bookings?${qs.toString()}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load group bookings')
  return data
}

export async function fetchRooms(apiBase) {
  if (!apiBase) return { rooms: [] }
  const res = await fetch(`${apiBase}/rooms`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load rooms')
  return data
}

export async function getGroupBookingById(apiBase, groupId) {
  if (!apiBase || !groupId) return null
  const res = await fetch(`${apiBase}/group-bookings/${groupId}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load group booking')
  return data
}

