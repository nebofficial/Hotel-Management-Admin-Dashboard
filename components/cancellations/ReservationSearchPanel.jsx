'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function ReservationSearchPanel({ search, onSearchChange, onSubmit, reservations, selected, onSelect, loading }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Search className="h-5 w-5" />
          Reservation Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit?.()
          }}
          className="flex gap-2"
        >
          <Input
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search by reservation #, guest name, or phone…"
            className="bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
          />
          <Button type="submit" className="h-9 bg-white text-emerald-700 hover:bg-emerald-50">
            {loading ? <Search className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </form>

        <div className="max-h-40 overflow-y-auto mt-2 space-y-1">
          {reservations?.length
            ? reservations.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelect?.(r)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-left ${
                    selected?.id === r.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white/10 border-white/20 text-emerald-50 hover:bg-white/20'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{r.guestName}</div>
                    <div className="text-[11px] text-emerald-100">
                      #{r.bookingNumber} • Room {r.roomNumber}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-emerald-100">
                    {new Date(r.checkIn).toLocaleDateString('en-IN')} –{' '}
                    {new Date(r.checkOut).toLocaleDateString('en-IN')}
                  </div>
                </button>
              ))
            : (
              <p className="text-[11px] text-emerald-100 text-center py-2">
                Search to load reservations eligible for cancellation / no-show.
              </p>
              )}
        </div>
      </CardContent>
    </Card>
  )
}

