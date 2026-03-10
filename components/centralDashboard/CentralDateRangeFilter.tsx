"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CentralDateRangeFilterProps {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  onApply: () => void
  onReset: () => void
}

export function CentralDateRangeFilter(p: CentralDateRangeFilterProps) {
  const { startDate, endDate, onStartChange, onEndChange, onApply, onReset } = p
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-800 px-3 py-2">
      <CalendarIcon className="h-4 w-4 text-white/90" />
      <input type="date" value={startDate} onChange={(e) => onStartChange(e.target.value)} className="rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-sm text-white" />
      <span className="text-white/70">-</span>
      <input type="date" value={endDate} onChange={(e) => onEndChange(e.target.value)} className="rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-sm text-white" />
      <Button size="sm" variant="secondary" onClick={onApply} className="h-8">Apply</Button>
      <Button size="sm" variant="ghost" onClick={onReset} className="h-8 text-white">Reset</Button>
    </div>
  )
}
