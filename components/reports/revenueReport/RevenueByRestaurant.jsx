'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function RevenueByRestaurant({ data, loading }) {
  const { totalOrders = 0, totalSales = 0, averageOrderValue = 0 } = data || {}
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-400/10 via-yellow-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-amber-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Restaurant</CardTitle>
        <p className="text-[11px] text-slate-500">Food and beverage income.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-[10px] uppercase text-slate-500">Total Orders</p>
              <p className="text-lg font-semibold">{totalOrders}</p>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-[10px] uppercase text-slate-500">Total Sales</p>
              <p className="text-lg font-semibold text-amber-600">₹{formatCurrency(totalSales)}</p>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-[10px] uppercase text-slate-500">Avg Order Value</p>
              <p className="text-lg font-semibold">₹{formatCurrency(averageOrderValue)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
