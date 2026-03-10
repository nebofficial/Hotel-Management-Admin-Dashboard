"use client"

import { LayoutDashboard } from "lucide-react"
import { CentralDateRangeFilter } from "./CentralDateRangeFilter"

export function CentralHeader(p: { startDate: string; endDate: string; onStartChange: (v: string) => void; onEndChange: (v: string) => void; onApply: () => void; onReset: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-indigo-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Central Dashboard</h1>
          <p className="text-sm text-gray-600">High-level performance view across all properties</p>
        </div>
      </div>
      <CentralDateRangeFilter {...p} />
    </div>
  )
}
