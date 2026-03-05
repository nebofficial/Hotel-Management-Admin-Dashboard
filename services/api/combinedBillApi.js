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

export async function fetchGuestFolio(apiBase, bookingId) {
  if (!apiBase || !bookingId) throw new Error('bookingId required')
  const res = await fetch(`${apiBase}/combined-bills/folio?bookingId=${encodeURIComponent(bookingId)}`, {
    headers: { Authorization: headers().Authorization },
  })
  return handle(res, 'Failed to fetch guest folio')
}

export async function addOtherCharges(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/combined-bills/other-charges`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to add other charges')
}

export async function calculateFinalBill(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/combined-bills/calculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to calculate final bill')
}

export async function applyAdvance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/combined-bills/apply-advance`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to apply advance')
}

export async function settleCombinedBill(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/combined-bills/settle`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to settle combined bill')
}

export async function generateFinalInvoice(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required')
  const res = await fetch(`${apiBase}/combined-bills/invoice`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handle(res, 'Failed to generate final invoice')
}

