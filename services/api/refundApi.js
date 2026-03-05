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

export async function fetchBillDetails(apiBase, params = {}) {
  if (!apiBase) return { bills: [] }
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${apiBase}/refunds/bills${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to fetch bills')
}

export async function initiateRefund(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/refunds/initiate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to initiate refund')
}

export async function approveRefund(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/refunds/approve`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to approve refund')
}

export async function processRefund(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/refunds/process`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to process refund')
}

export async function generateRefundReceipt(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/refunds/receipt`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to generate refund receipt')
}

