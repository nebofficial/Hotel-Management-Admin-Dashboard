const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getCalendarData(apiBase, params = {}) {
  if (!apiBase) return null
  const qs = new URLSearchParams()
  if (params.view) qs.set('view', params.view)
  if (params.start) qs.set('start', params.start)
  if (params.roomType) qs.set('roomType', params.roomType)

  const res = await fetch(`${apiBase}/availability-calendar?${qs.toString()}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load availability calendar')
  return data
}

export async function blockRoom(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/availability-calendar/block`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to create maintenance block')
  return data
}

export async function releaseBlock(apiBase, blockId) {
  if (!apiBase || !blockId) return null
  const res = await fetch(`${apiBase}/availability-calendar/${blockId}/release`, {
    method: 'POST',
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to release maintenance block')
  return data
}

export async function moveReservation(apiBase, bookingId, payload) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/reservations/${bookingId}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to update reservation dates')
  return data
}

