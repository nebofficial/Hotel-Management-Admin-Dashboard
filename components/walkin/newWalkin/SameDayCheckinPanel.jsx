'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Moon, Users } from 'lucide-react'

const OCCUPANCY_TYPES = [
  { value: 'single', label: 'Single Occupancy' },
  { value: 'double', label: 'Double Occupancy' },
  { value: 'triple', label: 'Triple Occupancy' },
  { value: 'quad', label: 'Quad Occupancy' },
]

export default function SameDayCheckinPanel({ value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  const today = new Date().toISOString().slice(0, 10)
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  const calculateNights = () => {
    if (!v.expectedCheckOut) return 1
    const checkIn = new Date()
    const checkOut = new Date(v.expectedCheckOut)
    const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Calendar className="h-5 w-5" />
          Same-Day Check-in
        </CardTitle>
        <p className="text-white/80 text-sm">Default: Today check-in with auto time</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" /> Check-in Time
            </Label>
            <div className="mt-1 bg-white/15 text-white border border-white/20 rounded-md h-10 px-3 flex items-center">
              <span className="font-medium">{currentTime}</span>
              <span className="text-white/60 ml-2 text-sm">(Now)</span>
            </div>
          </div>

          <div>
            <Label className="text-white/90 text-sm">Check-in Date</Label>
            <div className="mt-1 bg-white/15 text-white border border-white/20 rounded-md h-10 px-3 flex items-center">
              <span className="font-medium">{today}</span>
              <span className="text-white/60 ml-2 text-sm">(Today)</span>
            </div>
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Expected Check-out *
            </Label>
            <Input
              type="date"
              value={v.expectedCheckOut || ''}
              onChange={(e) => set({ expectedCheckOut: e.target.value })}
              min={today}
              className="mt-1 bg-white/15 text-white border-white/20 h-10 focus:bg-white/25"
            />
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Moon className="h-3 w-3" /> Number of Nights
            </Label>
            <div className="mt-1 bg-white/15 text-white border border-white/20 rounded-md h-10 px-3 flex items-center">
              <span className="font-bold text-lg">{calculateNights()}</span>
              <span className="text-white/60 ml-2">night(s)</span>
            </div>
          </div>

          <div className="col-span-2">
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Users className="h-3 w-3" /> Occupancy Type
            </Label>
            <Select value={v.occupancyType || 'single'} onValueChange={(val) => set({ occupancyType: val })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OCCUPANCY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
