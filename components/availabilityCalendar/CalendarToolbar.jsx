'use client'

import { addDays, format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, CalendarDays, Filter } from 'lucide-react'

const VIEWS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export default function CalendarToolbar({
  view,
  onViewChange,
  startDate,
  onStartDateChange,
  roomType,
  roomTypes,
  onRoomTypeChange,
}) {
  const current = startDate ? new Date(startDate) : new Date()

  const handlePrev = () => {
    if (view === 'daily') onStartDateChange(addDays(current, -1))
    else if (view === 'monthly') onStartDateChange(addDays(current, -30))
    else onStartDateChange(addDays(current, -7))
  }

  const handleNext = () => {
    if (view === 'daily') onStartDateChange(addDays(current, 1))
    else if (view === 'monthly') onStartDateChange(addDays(current, 30))
    else onStartDateChange(addDays(current, 7))
  }

  const handleToday = () => {
    onStartDateChange(new Date())
  }

  const label = (() => {
    if (view === 'daily') return format(current, 'dd MMM yyyy')
    if (view === 'monthly') return format(current, 'MMM yyyy')
    return `${format(current, 'dd MMM')} (Week)`
  })()

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <span>Room Availability Calendar</span>
          </div>
          <span className="text-sm text-emerald-100">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select value={view} onValueChange={onViewChange}>
              <SelectTrigger className="h-9 w-[120px] bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEWS.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 bg-white/10 border border-white/30 rounded-lg px-3 py-1.5">
              <Filter className="h-3 w-3 text-emerald-100" />
              <Select value={roomType || 'all'} onValueChange={(val) => onRoomTypeChange(val === 'all' ? '' : val)}>
                <SelectTrigger className="h-7 w-[160px] bg-transparent border-0 text-xs text-white">
                  <SelectValue placeholder="All room types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All room types</SelectItem>
                  {(roomTypes || []).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

