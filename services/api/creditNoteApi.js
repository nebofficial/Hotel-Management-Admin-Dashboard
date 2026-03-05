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

export async function fetchInvoiceDetails(apiBase, params = {}) {
  if (!apiBase) return { invoices: [] }
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${apiBase}/credit-notes/invoices${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to fetch invoices')
}

export async function createCreditNote(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/credit-notes/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to create credit note')
}

export async function applyCredit(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/credit-notes/apply`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to apply credit')
}

export async function fetchOutstandingCredits(apiBase, params = {}) {
  if (!apiBase) return { list: [], summary: {} }
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${apiBase}/credit-notes/outstanding${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to fetch outstanding credits')
}

export async function trackCreditExpiry(apiBase) {
  if (!apiBase) return { items: [], expiringSoon: [], expired: [] }
  const res = await fetch(`${apiBase}/credit-notes/expiry`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to track expiry')
}

export async function generateCreditNotePDF(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/credit-notes/pdf`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to generate credit note')
}

