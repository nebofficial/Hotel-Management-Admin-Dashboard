'use client'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function InventorySummaryCards({ summary }) {
  const s = summary || {}
  const totalItems = s.totalItems ?? 0
  const totalInventoryValue = s.totalInventoryValue ?? 0
  const lowStockItems = s.lowStockItems ?? 0
  const stockConsumedToday = s.stockConsumedToday ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Inventory Items</p>
        <div className="text-2xl font-semibold mt-1">{totalItems}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Inventory Value</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalInventoryValue)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Low Stock Items</p>
        <div className="text-2xl font-semibold mt-1">{lowStockItems}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-teal-500 text-slate-800 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Stock Consumed Today</p>
        <div className="text-2xl font-semibold mt-1">{formatCurrency(stockConsumedToday)}</div>
      </div>
    </div>
  )
}
