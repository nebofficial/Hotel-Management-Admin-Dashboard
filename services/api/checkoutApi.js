const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getStaySummary(apiBase, bookingId) {
  if (!apiBase || !bookingId) throw new Error('Missing bookingId')
  const res = await fetch(`${apiBase}/checkout/stay?bookingId=${encodeURIComponent(bookingId)}`, {
    headers: headers(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load stay summary')
  return data
}

export async function generateFinalBill(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkout/final-bill`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to generate final bill')
  return data
}

export async function addPendingCharge(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkout/pending-charge`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to add pending charge')
  return data
}

export async function processPayment(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkout/process-payment`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to process payment')
  return data
}

export async function closeStay(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkout/close-stay`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to close stay')
  return data
}

export async function sendInvoice(apiBase, payload) {
  if (!apiBase) throw new Error('Missing apiBase')
  const res = await fetch(`${apiBase}/checkout/send-invoice`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to send invoice')
  return data
}

