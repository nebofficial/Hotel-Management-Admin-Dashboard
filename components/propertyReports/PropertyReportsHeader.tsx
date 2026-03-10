"use client"

import { FileText } from "lucide-react"
import { DateRangeFilter } from "./DateRangeFilter"
import { PropertySelector } from "./PropertySelector"

interface PropertyReportsHeaderProps {
  properties: { id: string; name: string }[]
  selectedPropertyId: string
  onPropertyChange: (id: string) => void
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  onApply: () => void
  onReset: () => void
}

export function PropertyReportsHeader(props: PropertyReportsHeaderProps) {
  const {
    properties,
    selectedPropertyId,
    onPropertyChange,
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    onApply,
    onReset,
  } = props

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-emerald-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Property-wise Reports</h1>
          <p className="text-sm text-gray-600">
            Generate occupancy, revenue, expense, inventory, staff and restaurant reports per property.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:items-end">
        <PropertySelector
          properties={properties}
          value={selectedPropertyId}
          onChange={onPropertyChange}
        />
        <DateRangeFilter
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

