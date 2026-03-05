const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

export async function fetchRoomBills(apiBase) {
  if (!apiBase) return { list: [] }
  const res = await fetch(`${apiBase}/room-bills`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to fetch room bills')
  return data
}

export async function fetchBookingDetails(apiBase, bookingId) {
  if (!apiBase || !bookingId) return null
  const res = await fetch(`${apiBase}/room-bills/booking/${bookingId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to fetch booking details')
  return data
}

export async function postCharge(apiBase, payload) {
  if (!apiBase || !payload?.guestId) throw new Error('Invalid params')
  const { guestId, bookingId, type, amount, description } = payload
  const res = await fetch(`${apiBase}/guest-ledger/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
      guestId,
      bookingId: bookingId || null,
      type: type || 'ROOM_CHARGE',
      amount: Number(amount),
      description: description || type,
      isDebit: true,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to post charge')
  return data
}

export async function postDiscount(apiBase, payload) {
  if (!apiBase || !payload?.guestId) throw new Error('Invalid params')
  const { guestId, bookingId, amount, description } = payload
  const res = await fetch(`${apiBase}/guest-ledger/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
      guestId,
      bookingId: bookingId || null,
      type: 'ADJUSTMENT',
      amount: Math.abs(Number(amount)),
      description: description || 'Discount',
      isDebit: false,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to post discount')
  return data
}

export async function settleBill(apiBase, payload) {
  const { bookingId, guestId, guestName, payments, createInvoice, subtotal, taxAmount, items } = payload || {}
  if (!apiBase || !bookingId || !guestId || !guestName || !payments?.length) throw new Error('Invalid params')
  const methodMap = { upi: 'bank_transfer', card: 'credit_card' }
  const mappedPayments = payments.map((p) => ({ ...p, method: methodMap[p.method] || p.method }))
  const res = await fetch(`${apiBase}/room-bills/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
      bookingId,
      guestId,
      guestName,
      payments: mappedPayments,
      createInvoice: !!createInvoice,
      subtotal: Number(subtotal || 0),
      taxAmount: Number(taxAmount || 0),
      items: items || [],
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to settle bill')
  return data
}
