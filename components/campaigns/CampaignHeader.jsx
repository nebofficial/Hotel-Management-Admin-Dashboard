'use client'

import { Plus } from 'lucide-react'

export function CampaignHeader({ onCreate }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Email / SMS Campaigns</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Run targeted marketing campaigns to engage guests and increase bookings.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center justify-center h-9 px-3 rounded-full text-xs font-medium text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 shadow-sm hover:shadow-md transition-all"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        New Campaign
      </button>
    </div>
  )
}

