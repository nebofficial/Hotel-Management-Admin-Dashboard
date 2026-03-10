'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StaffPerformanceHeader({ onRefresh, loading }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Staff Performance Report</h1>
        <p className="text-xs text-slate-500 mt-0.5">Employee productivity &amp; performance analytics</p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-2"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  )
}

