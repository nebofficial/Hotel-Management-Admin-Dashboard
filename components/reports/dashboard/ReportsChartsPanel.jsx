'use client'

import { RevenueChart } from './RevenueChart'
import { OccupancyChart } from './OccupancyChart'
import { SalesChart } from './SalesChart'

export function ReportsChartsPanel({ charts }) {
  const { revenueTrend = [], occupancyTrend = [], salesBreakdown = [] } = charts || {}

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RevenueChart data={revenueTrend} />
        <OccupancyChart data={occupancyTrend} />
      </div>
      <SalesChart data={salesBreakdown} />
    </div>
  )
}

