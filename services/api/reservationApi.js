const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchNextReservationNumber(apiBase) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/reservations/next-number`, { headers: headers() })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to generate reservation number')
  return data.nextNumber
}

export async function checkAvailability(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/reservations/availability`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to check availability')
  return data
}

export async function pricingQuote(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/reservations/pricing`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to calculate pricing')
  return data
}

export async function createReservation(apiBase, payload) {
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/reservations`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to create reservation')
  return data
}

export async function collectAdvance(apiBase, bookingId, payload) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/reservations/${bookingId}/collect-advance`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to collect advance')
  return data
}

export async function getAllReservations(apiBase, params = {}) {
  if (!apiBase) return { reservations: [] }
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.checkInFrom) qs.set('checkInFrom', params.checkInFrom)
  if (params.checkInTo) qs.set('checkInTo', params.checkInTo)
  if (params.roomType) qs.set('roomType', params.roomType)
  if (params.search) qs.set('search', params.search)

  const res = await fetch(`${apiBase}/reservations?${qs.toString()}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load reservations')
  return data
}

export async function getReservationById(apiBase, bookingId) {
  if (!apiBase || !bookingId) return null
  const res = await fetch(`${apiBase}/reservations/${bookingId}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load reservation')
  return data
}

export async function updateReservation(apiBase, bookingId, payload) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/reservations/${bookingId}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to update reservation')
  return data
}

export async function cancelReservation(apiBase, bookingId, payload) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/reservations/${bookingId}/cancel`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to cancel reservation')
  return data
}

export async function filterReservations(apiBase, params = {}) {
  return getAllReservations(apiBase, params)
}


