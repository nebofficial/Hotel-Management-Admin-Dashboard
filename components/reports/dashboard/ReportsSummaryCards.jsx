'use client'

import { RevenueSummaryCard } from './RevenueSummaryCard'
import { OccupancyStatsCard } from './OccupancyStatsCard'
import { RestaurantSalesOverview } from './RestaurantSalesOverview'
import { ExpenseSummaryCard } from './ExpenseSummaryCard'

export function ReportsSummaryCards({ revenueSummary, occupancyStats, restaurantSales, expenseSummary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <RevenueSummaryCard data={revenueSummary} />
      <OccupancyStatsCard data={occupancyStats} />
      <RestaurantSalesOverview data={restaurantSales} />
      <ExpenseSummaryCard data={expenseSummary} />
    </div>
  )
}

