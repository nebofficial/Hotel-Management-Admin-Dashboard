'use client'

import { useState } from 'react'

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
]

export default function DateFilter({ value, onChange, startDate, endDate, onCustomChange, onApply }) {
  const preset = value || 'monthly'

  const handlePreset = (p) => {
    onChange?.(p)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-600">Period:</span>
      {PRESETS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => handlePreset(p.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            preset === p.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {p.label}
        </button>
      ))}
      {preset === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => {
              onChange?.('custom')
              onCustomChange?.({ startDate: e.target.value, endDate: endDate })
            }}
            className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => {
              onChange?.('custom')
              onCustomChange?.({ startDate, endDate: e.target.value })
            }}
            className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={() => onApply?.()}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
