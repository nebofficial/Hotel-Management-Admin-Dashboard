'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Filter } from 'lucide-react'

export default function ItemSearchFilter({ query, category, onQueryChange, onCategoryChange, categories = [] }) {
  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-semibold text-slate-900">Search & Filter</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={query || ''}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search by name, SKU, or barcode…"
            className="pl-9 text-sm"
          />
        </div>
        <div>
          <select
            value={category || ''}
            onChange={(e) => onCategoryChange?.(e.target.value || null)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id || cat} value={typeof cat === 'string' ? cat : cat.name}>
                {typeof cat === 'string' ? cat : cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
