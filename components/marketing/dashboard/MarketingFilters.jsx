'use client'

import { useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

function toDateInputValue(date) {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function MarketingFilters({
  startDate,
  endDate,
  otaChannel,
  roomCategory,
  ratePlan,
  onChangeStart,
  onChangeEnd,
  onChangeOtaChannel,
  onChangeRoomCategory,
  onChangeRatePlan,
  onReset,
}) {
  const today = useMemo(() => new Date(), [])

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-700 to-orange-800 text-amber-50 p-4 flex flex-col lg:flex-row lg:items-end gap-3">
      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200">Filters</p>
        <p className="text-[11px] text-amber-100/90">
          Date range, OTA channel, room category and rate plan to refine marketing analytics.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-[11px] text-amber-50">From</Label>
          <Input
            type="date"
            className="h-8 text-xs bg-amber-950/40 border-amber-400/70 text-amber-50"
            value={toDateInputValue(startDate)}
            max={toDateInputValue(endDate || today)}
            onChange={(e) => onChangeStart?.(e.target.value || null)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-amber-50">To</Label>
          <Input
            type="date"
            className="h-8 text-xs bg-amber-950/40 border-amber-400/70 text-amber-50"
            value={toDateInputValue(endDate)}
            max={toDateInputValue(today)}
            onChange={(e) => onChangeEnd?.(e.target.value || null)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-amber-50">OTA Channel</Label>
          <Input
            type="text"
            placeholder="e.g. Booking.com"
            className="h-8 text-xs bg-amber-950/40 border-amber-400/70 text-amber-50 placeholder:text-amber-200/70"
            value={otaChannel || ''}
            onChange={(e) => onChangeOtaChannel?.(e.target.value || '')}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-amber-50">Room Category</Label>
          <Input
            type="text"
            placeholder="Deluxe, Suite..."
            className="h-8 text-xs bg-amber-950/40 border-amber-400/70 text-amber-50 placeholder:text-amber-200/70"
            value={roomCategory || ''}
            onChange={(e) => onChangeRoomCategory?.(e.target.value || '')}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-amber-50">Rate Plan</Label>
          <Input
            type="text"
            placeholder="Standard, Corporate..."
            className="h-8 text-xs bg-amber-950/40 border-amber-400/70 text-amber-50 placeholder:text-amber-200/70"
            value={ratePlan || ''}
            onChange={(e) => onChangeRatePlan?.(e.target.value || '')}
          />
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center h-8 px-3 rounded-full text-[11px] font-medium border border-amber-200/80 text-amber-50 bg-amber-900/40 hover:bg-amber-800/70 transition-colors"
        >
          Last 30 days
        </button>
      </div>
    </div>
  )
}

