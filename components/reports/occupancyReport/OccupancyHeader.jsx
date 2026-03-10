'use client'

import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export function OccupancyHeader({ onRefresh, loading }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Occupancy Report</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Room occupancy analytics: daily, weekly, monthly, and by room type.
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5 text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCcw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
        {loading ? 'Refreshing' : 'Refresh'}
      </Button>
    </div>
  )
}
