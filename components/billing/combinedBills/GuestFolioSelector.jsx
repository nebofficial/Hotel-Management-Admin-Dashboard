'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/app/auth-context'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function GuestFolioSelector({ onSelectFolio }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState([])
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    if (!user?.hotelId) return
    const apiBase =
      typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? `http://${window.location.hostname}:5000/api/hotel-data/${user.hotelId}`
        : `${API_BASE}/api/hotel-data/${user.hotelId}`

    const fetchBookings = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${apiBase}/guest-ledger`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.message || 'Failed to load guests')
        setBookings(data.list || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user?.hotelId])

  const handleChange = (value) => {
    setSelectedId(value)
    const booking = bookings.find((b) => b.id === value)
    if (booking && onSelectFolio) {
      onSelectFolio(booking)
    }
  }

  return (
    <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-emerald-900">Guest Folio Selection</h3>
        <p className="text-xs text-emerald-800/80">
          Select an in-house or recently checked-out guest to merge all charges.
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <Select value={selectedId} onValueChange={handleChange} disabled={loading || bookings.length === 0}>
          <SelectTrigger className="bg-white/80">
            <SelectValue placeholder={loading ? 'Loading guests...' : 'Select in-house guest'} />
          </SelectTrigger>
          <SelectContent>
            {bookings.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.guestName} – Room {b.roomNumber} ({new Date(b.checkIn).toLocaleDateString()} →{' '}
                {new Date(b.checkOut).toLocaleDateString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-rose-700">{error}</p>}
      </CardContent>
    </Card>
  )
}

