const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

async function handleRes(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || fallbackMsg)
  return data
}

export async function getStats(apiBase) {
  if (!apiBase) return { totalBillsToday: 0, totalRevenue: 0, pendingSettlements: 0, refundedBills: 0 }
  const res = await fetch(`${apiBase}/restaurant-bills/stats`, { headers: headers() })
  return handleRes(res, 'Failed to fetch stats')
}

export async function getNextBillNumber(apiBase) {
  if (!apiBase) return { billNumber: 'BILL-2026-0001' }
  const res = await fetch(`${apiBase}/restaurant-bills/next-number`, { headers: headers() })
  return handleRes(res, 'Failed to get bill number')
}

export async function createBill(apiBase, payload) {
  if (!apiBase) throw new Error('API base required')
  const res = await fetch(`${apiBase}/restaurant-bills`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handleRes(res, 'Failed to create bill')
}

export async function addItemToBill(apiBase, billId, item) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}/add-item`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ item }),
  })
  return handleRes(res, 'Failed to add item')
}

export async function applyDiscount(apiBase, billId, payload) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}/apply-discount`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handleRes(res, 'Failed to apply discount')
}

export async function generateKOT(apiBase, billId) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}/generate-kot`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({}),
  })
  return handleRes(res, 'Failed to generate KOT')
}

export async function settleBill(apiBase, billId, payload) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}/settle`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handleRes(res, 'Failed to settle bill')
}

export async function processRefund(apiBase, billId, payload) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}/refund`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  return handleRes(res, 'Failed to process refund')
}

export async function getBill(apiBase, billId) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}`, { headers: headers() })
  return handleRes(res, 'Failed to get bill')
}

export async function listBills(apiBase, params = {}) {
  if (!apiBase) return { bills: [] }
  const qs = new URLSearchParams(params).toString()
  const url = `${apiBase}/restaurant-bills${qs ? `?${qs}` : ''}`
  const res = await fetch(url, { headers: headers() })
  return handleRes(res, 'Failed to list bills')
}

export async function cancelBill(apiBase, billId) {
  if (!apiBase || !billId) throw new Error('API base and bill ID required')
  const res = await fetch(`${apiBase}/restaurant-bills/${billId}/cancel`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({}),
  })
  return handleRes(res, 'Failed to cancel bill')
}
