"use client"

import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

interface PropertyDateRangeFilterProps {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  onApply: () => void
  onReset: () => void
}

export function PropertyDateRangeFilter(props: PropertyDateRangeFilterProps) {
  const { startDate, endDate, onStartChange, onEndChange, onApply, onReset } = props
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 px-3 py-2 shadow-sm">
      <CalendarIcon className="h-4 w-4 text-amber-600" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="rounded border border-amber-200 bg-white px-2 py-1.5 text-sm"
      />
      <span className="text-amber-700">–</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="rounded border border-amber-200 bg-white px-2 py-1.5 text-sm"
      />
      <Button size="sm" variant="default" onClick={onApply} className="h-8">Apply</Button>
      <Button size="sm" variant="outline" onClick={onReset} className="h-8">Reset</Button>
    </div>
  )
}
