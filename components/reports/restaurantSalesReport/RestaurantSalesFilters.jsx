'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

function toDateInputValue(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function RestaurantSalesFilters({ startDate, endDate, onChangeStart, onChangeEnd, onReset }) {
  const today = useMemo(() => new Date(), []);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4 flex flex-col md:flex-row md:items-end gap-3">
      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-300">Filters</p>
        <p className="text-[11px] text-slate-300">Date range for dynamic sales insights.</p>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-200">From</Label>
          <Input
            type="date"
            className="h-8 text-xs bg-slate-900/40 border-slate-600"
            value={toDateInputValue(startDate)}
            max={toDateInputValue(endDate || today)}
            onChange={(e) => onChangeStart?.(e.target.value || null)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-200">To</Label>
          <Input
            type="date"
            className="h-8 text-xs bg-slate-900/40 border-slate-600"
            value={toDateInputValue(endDate)}
            max={toDateInputValue(today)}
            onChange={(e) => onChangeEnd?.(e.target.value || null)}
          />
        </div>
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px] border-slate-500 text-slate-100 hover:bg-slate-700/60" onClick={onReset}>
          Last 30 days
        </Button>
      </div>
    </div>
  )
}
