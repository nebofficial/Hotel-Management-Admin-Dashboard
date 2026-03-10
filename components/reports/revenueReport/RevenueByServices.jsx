'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function RevenueByServices({ services = [], totalServiceRevenue = 0, loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Services</CardTitle>
        <p className="text-[11px] text-slate-500">Spa, Laundry, Room Service, Bar, Extras.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No service revenue</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-orange-600 mb-2">Total: ₹{formatCurrency(totalServiceRevenue)}</p>
            <div className="space-y-2">
              {services.map((s, i) => (
                <div key={i} className="flex justify-between py-2 px-2 rounded-lg bg-white/80">
                  <span className="text-xs text-slate-700">{s.name}</span>
                  <span className="text-xs font-semibold">₹{formatCurrency(s.revenue)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
