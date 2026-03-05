'use client'

import { Search } from 'lucide-react'

export default function TransactionSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || 'Search by invoice, guest...'}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
      />
    </div>
  )
}
