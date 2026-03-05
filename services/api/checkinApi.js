const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function confirmArrival(apiBase, bookingId) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/checkin/confirm-arrival`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ bookingId }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to confirm arrival')
  return data
}

export async function assignRoom(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkin/assign-room`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to assign room')
  return data
}

export async function collectDeposit(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkin/collect-deposit`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to collect deposit')
  return data
}

export async function activateStay(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkin/activate-stay`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to activate stay')
  return data
}

