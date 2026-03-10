"use client"

import { Building2 } from "lucide-react"
import { PropertyDateRangeFilter } from "./PropertyDateRangeFilter"

interface MultiPropertyHeaderProps {
  title?: string
  description?: string
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  onApply: () => void
  onReset: () => void
}

export function MultiPropertyHeader({
  title = "Multi-Property Dashboard",
  description = "Centralized overview of all hotel properties — occupancy, revenue, performance, and activity.",
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onApply,
  onReset,
}: MultiPropertyHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Building2 className="h-6 w-6 text-emerald-600" />
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <PropertyDateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          onApply={onApply}
          onReset={onReset}
        />
      </div>
    </div>
  )
}
