'use client'

import { Input } from '@/components/ui/input'

export function RolesSearchBar({ value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <Input
        className="h-8 text-xs max-w-xs"
        placeholder="Search roles..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

