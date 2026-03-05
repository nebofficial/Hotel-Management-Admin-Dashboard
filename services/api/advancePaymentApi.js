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

export async function getAdvanceHistory(apiBase, params = {}) {
  if (!apiBase) return { list: [], summary: {} }
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${apiBase}/advance-payments/history${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to load advance history')
}

export async function collectAdvance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/advance-payments/collect`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to collect advance')
}

export async function linkAdvanceToBooking(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/advance-payments/link`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to link advance')
}

export async function adjustAdvance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/advance-payments/adjust`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to adjust advance')
}

export async function refundAdvance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/advance-payments/refund`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to refund advance')
}

