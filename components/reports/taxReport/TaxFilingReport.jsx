'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function TaxFilingReport({ data, loading }) {
  const { monthlySummary = [], totalTaxPayable = 0, filingPeriod = {} } = data || {}

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-red-600/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-red-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Tax Filing Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">Prepared data for government tax filing.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <>
            <div className="rounded-xl bg-red-50/80 p-3 mb-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-600">Total Tax Payable</p>
              <p className="text-xl font-bold text-red-600">₹{formatCurrency(totalTaxPayable)}</p>
              {filingPeriod?.startDate && filingPeriod?.endDate && (
                <p className="text-[10px] text-slate-500 mt-1">
                  Period: {filingPeriod.startDate} to {filingPeriod.endDate}
                </p>
              )}
            </div>
            {monthlySummary.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {monthlySummary.map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-2 rounded-md bg-white/80 text-xs">
                    <span className="text-slate-700">{m.monthLabel || m.month}</span>
                    <span className="font-semibold text-slate-800">₹{formatCurrency(m.taxPayable ?? m.gstVat ?? 0)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No monthly data for selected period.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
