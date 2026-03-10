'use client'

import { RefreshCw } from 'lucide-react'

export function MarketingHeader({ onRefresh, loading }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Marketing &amp; OTA Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Overview of room pricing, campaigns, OTA channels and revenue performance.
        </p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center justify-center h-9 px-3 rounded-full text-xs font-medium border border-emerald-500/70 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-60"
      >
        <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  )
}

