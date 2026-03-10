'use client'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function RestaurantSalesStatsCards({ summary }) {
  const {
    totalRestaurantRevenue = 0,
    totalOrders = 0,
    averageOrderValue = 0,
    topSellingItem = '-',
  } = summary || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Restaurant Revenue</p>
        <div className="text-2xl font-semibold mt-1">{formatCurrency(totalRestaurantRevenue)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Orders</p>
        <div className="text-2xl font-semibold mt-1">{totalOrders}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Avg Order Value</p>
        <div className="text-2xl font-semibold mt-1">{formatCurrency(averageOrderValue)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 text-slate-900 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Top Selling Item</p>
        <div className="text-lg font-semibold mt-1 truncate">{topSellingItem}</div>
      </div>
    </div>
  )
}
