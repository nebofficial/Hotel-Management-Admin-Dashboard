'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, CheckCircle2 } from 'lucide-react'

export default function ArrivalConfirmation({ onSearch, reservations, selected, onSelect, onConfirm, confirming }) {
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Search className="h-5 w-5" />
          Arrival Confirmation
        </CardTitle>
        <p className="text-white/80 text-sm">Search by name, phone, or booking number</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reservations…"
            className="bg-white/15 text-white placeholder:text-white/70 border-white/20 h-10"
          />
          <Button type="submit" className="h-10 bg-white text-emerald-700 hover:bg-emerald-50">
            Search
          </Button>
        </form>

        <div className="max-h-56 overflow-y-auto space-y-1 mt-2">
          {(reservations || []).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect?.(r)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm flex items-center justify-between ${
                selected?.id === r.id
                  ? 'bg-white/25 border-white text-white'
                  : 'bg-white/10 border-white/20 text-emerald-50 hover:bg-white/20'
              }`}
            >
              <div>
                <div className="font-semibold">
                  {r.guestName}{' '}
                  <span className="text-xs text-emerald-100 font-normal">#{r.bookingNumber}</span>
                </div>
                <div className="text-xs text-emerald-100">
                  Room {r.roomNumber} • {new Date(r.checkIn).toLocaleDateString('en-IN')} –{' '}
                  {new Date(r.checkOut).toLocaleDateString('en-IN')}
                </div>
              </div>
            </button>
          ))}
          {!reservations?.length && (
            <p className="text-xs text-emerald-100 text-center py-3">Search to load pending arrivals.</p>
          )}
        </div>

        <Button
          disabled={!selected || confirming}
          onClick={() => onConfirm?.(selected)}
          className="w-full mt-2 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold h-10"
        >
          {confirming ? (
            'Confirming…'
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Guest Arrival
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

