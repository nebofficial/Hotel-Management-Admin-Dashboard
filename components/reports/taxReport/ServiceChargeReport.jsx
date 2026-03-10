'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function ServiceChargeReport({ data, loading }) {
  const { totalServiceCharges = 0, serviceChargeRevenue = 0, rates = [] } = data || {}

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-violet-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          Service Charge Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">Service charges applied to bills.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/80 p-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Total Service Charges</p>
                <p className="text-lg font-semibold text-purple-600">₹{formatCurrency(totalServiceCharges)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Service Charge Revenue</p>
                <p className="text-lg font-semibold text-slate-800">₹{formatCurrency(serviceChargeRevenue)}</p>
              </div>
            </div>
            {rates?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">By Rate</p>
                <div className="flex flex-wrap gap-2">
                  {rates.map((r, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs"
                    >
                      {r.rate}: ₹{formatCurrency(r.amount)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
