'use client'

import { Plus, Upload } from 'lucide-react'

export function RatePlansHeader({ onCreate, onExport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Rate Plans</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage dynamic pricing, meal plans and stay rules across room categories.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center h-9 px-3 rounded-full text-xs font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <Upload className="w-4 h-4 mr-1.5" />
          Export
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center h-9 px-3 rounded-full text-xs font-medium text-white bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Rate Plan
        </button>
      </div>
    </div>
  )
}

