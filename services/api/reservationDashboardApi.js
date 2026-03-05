const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

export async function fetchReservationDashboard(apiBase, params = {}) {
  if (!apiBase) return null
  const qs = new URLSearchParams()
  if (params.period) qs.set('period', params.period)
  if (params.startDate) qs.set('startDate', params.startDate)
  if (params.endDate) qs.set('endDate', params.endDate)

  const res = await fetch(`${apiBase}/reservation-dashboard?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load reservation dashboard')
  return data
}

export async function fetchRecentBookings(apiBase) {
  if (!apiBase) return { bookings: [] }
  const res = await fetch(`${apiBase}/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load bookings')
  return data
}

