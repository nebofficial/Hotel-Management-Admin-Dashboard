'use client'

import { Input } from '@/components/ui/input'

export function AttendanceSearchBar({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Input
        className="h-8 text-xs max-w-xs"
        placeholder="Search staff by name..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

