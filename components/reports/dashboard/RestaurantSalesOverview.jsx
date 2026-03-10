'use client'

export function RestaurantSalesOverview({ data }) {
  const { totalSales = 0, ordersCount = 0, avgOrderValue = 0, topItems = [] } = data || {}

  const format = (value) =>
    typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : value || 0

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-violet-500 text-white shadow-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide opacity-80">Restaurant Sales</p>
        <span className="text-[11px] bg-purple-900/30 px-2 py-0.5 rounded-full">
          {ordersCount || 0} orders
        </span>
      </div>
      <div className="text-2xl font-semibold">{format(totalSales)}</div>
      <p className="text-[11px] opacity-90">Avg. order value: {format(avgOrderValue)}</p>
      {topItems?.length > 0 && (
        <div className="text-[11px] space-y-1">
          <p className="opacity-80">Top selling items</p>
          <div className="flex flex-wrap gap-1.5">
            {topItems.slice(0, 4).map((item) => (
              <span
                key={item.name}
                className="px-2 py-0.5 rounded-full bg-purple-900/25 border border-purple-200/40"
              >
                {item.name} · {format(item.total)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

