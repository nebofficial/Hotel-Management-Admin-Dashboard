'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function ShiftHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Shift Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage staff shifts, timings, and schedules</p>
      </div>
      <Button
        type="button"
        size="sm"
        className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
        onClick={onCreate}
      >
        <Plus className="w-4 h-4" />
        Create Shift
      </Button>
    </div>
  )
}
