'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function WalkinFilters({ filters, onChange, onClear }) {
  const f = filters || {}
  const set = (patch) => onChange && onChange({ ...f, ...patch })

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl shadow-sm border">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={f.search || ''}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search walk-in, guest, room..."
          className="pl-9 h-9"
        />
      </div>

      <Select value={f.status || 'all'} onValueChange={(val) => set({ status: val === 'all' ? '' : val })}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={f.dateFrom || ''}
        onChange={(e) => set({ dateFrom: e.target.value })}
        className="w-[140px] h-9"
        placeholder="From date"
      />

      <Input
        type="date"
        value={f.dateTo || ''}
        onChange={(e) => set({ dateTo: e.target.value })}
        className="w-[140px] h-9"
        placeholder="To date"
      />

      <Button variant="ghost" size="sm" onClick={onClear} className="h-9">
        <X className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  )
}
