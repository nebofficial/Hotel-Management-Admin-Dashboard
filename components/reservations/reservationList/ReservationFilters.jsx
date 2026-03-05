'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import DateRangeFilter from './DateRangeFilter'
import ReservationSearch from './ReservationSearch'

export default function ReservationFilters({ filters, onChange }) {
  const f = filters || {}
  const set = (patch) => onChange && onChange({ ...f, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 text-white">
      <CardHeader>
        <CardTitle className="text-white text-sm">Filter & Search</CardTitle>
        <div className="text-xs text-purple-100/90">
          Filter by status, dates, room type and instantly search by guest, phone or reservation number.
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <Label className="text-purple-50">Status</Label>
            <Select
              value={f.status || 'all'}
              onValueChange={(status) => set({ status: status === 'all' ? '' : status })}
            >
              <SelectTrigger className="mt-1 h-8 bg-white/15 text-purple-50 border-purple-100/40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="checked_in">Checked-in</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-purple-50">Room Type</Label>
            <Select
              value={f.roomType || 'all'}
              onValueChange={(roomType) => set({ roomType: roomType === 'all' ? '' : roomType })}
            >
              <SelectTrigger className="mt-1 h-8 bg-white/15 text-purple-50 border-purple-100/40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Double">Double</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DateRangeFilter
          value={{ checkInFrom: f.checkInFrom, checkInTo: f.checkInTo }}
          onChange={(v) => set({ checkInFrom: v.checkInFrom, checkInTo: v.checkInTo })}
        />

        <ReservationSearch
          value={{
            guestName: f.guestName,
            phone: f.phone,
            reservationNumber: f.reservationNumber,
          }}
          onChange={(v) =>
            set({
              guestName: v.guestName,
              phone: v.phone,
              reservationNumber: v.reservationNumber,
            })
          }
        />
      </CardContent>
    </Card>
  )
}

