'use client'

import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export function RoomRevenueHeader({ onRefresh, loading }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Room Revenue Report</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Revenue by room type, ADR, RevPAR, and trend analytics.
        </p>
      </div>
      <Button type="button" size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onRefresh} disabled={loading}>
        <RefreshCcw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
        {loading ? 'Refreshing' : 'Refresh'}
      </Button>
    </div>
  )
}
