'use client'

import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export function ReportsHeader({ onRefresh, loading }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Reports Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive overview of revenue, occupancy, sales, expenses, and key KPIs.
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
        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Refreshing' : 'Refresh'}
      </Button>
    </div>
  )
}

