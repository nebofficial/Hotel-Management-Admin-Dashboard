const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function calculateCancellationFee(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/cancellations/calculate-fee`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to calculate cancellation fee')
  return data
}

export async function cancelReservation(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/cancellations/cancel`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to cancel reservation')
  return data
}

export async function processRefund(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/cancellations/refund`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to process refund')
  return data
}

export async function markNoShow(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/cancellations/no-show`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to mark no-show')
  return data
}

