'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/app/auth-context'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function BookingSelector({ onSelect }) {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState('')

  useEffect(() => {
    if (!user?.hotelId) return
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const base =
      host !== 'localhost' && host !== '127.0.0.1'
        ? `http://${host}:5000`
        : API_BASE
    const apiBase = `${base}/api/hotel-data/${user.hotelId}`

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${apiBase}/guest-ledger`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.message || 'Failed to load bookings')
        setList(data.list || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.hotelId])

  const handleChange = (value) => {
    setSelected(value)
    const booking = list.find((b) => b.id === value)
    onSelect?.(booking || null)
  }

  return (
    <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-emerald-900">Collect Advance</h3>
        <p className="text-xs text-emerald-800/80">
          Select a reservation to link this advance receipt.
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <Select value={selected} onValueChange={handleChange} disabled={loading || list.length === 0}>
          <SelectTrigger className="bg-white/80">
            <SelectValue placeholder={loading ? 'Loading reservations...' : 'Select booking'} />
          </SelectTrigger>
          <SelectContent>
            {list.map((b) => (
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

