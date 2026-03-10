"use client"

import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

interface DateRangeFilterProps {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  onApply: () => void
  onReset: () => void
}

export function DateRangeFilter(props: DateRangeFilterProps) {
  const { startDate, endDate, onStartChange, onEndChange, onApply, onReset } = props
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2">
      <CalendarIcon className="h-4 w-4 text-white/90" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-white"
      />
      <span className="text-white/70">–</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-white"
      />
      <Button size="sm" variant="secondary" onClick={onApply} className="h-8">
        Apply
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onReset}
        className="h-8 text-white hover:bg-white/10"
      >
        Reset
      </Button>
    </div>
  )
}

