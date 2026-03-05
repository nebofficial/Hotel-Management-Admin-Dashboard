const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getStayForAdjustment(apiBase, bookingId) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/stay-adjustments/stay?bookingId=${encodeURIComponent(bookingId)}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load stay details')
  return data
}

export async function calculateHourlyCharge(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/stay-adjustments/calculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to calculate charge')
  return data
}

export async function requestApproval(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/stay-adjustments/request-approval`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to request approval')
  return data
}

export async function applyExtraCharge(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/stay-adjustments/apply-charge`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to apply charge')
  return data
}

export async function notifyHousekeeping(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/stay-adjustments/notify-housekeeping`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to notify housekeeping')
  return data
}

