'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function TaxSummaryTable({ summary, loading }) {
  const {
    totalTaxCollected = 0,
    gstVatCollected = 0,
    serviceChargesCollected = 0,
    totalTaxableRevenue = 0,
    taxPercentage = 0,
  } = summary || {}

  const rows = [
    { label: 'Total Taxable Revenue', value: totalTaxableRevenue },
    { label: 'Total Tax Collected', value: totalTaxCollected },
    { label: 'GST / VAT', value: gstVatCollected },
    { label: 'Service Charges', value: serviceChargesCollected },
    { label: 'Effective Tax %', value: taxPercentage > 0 ? `${taxPercentage.toFixed(1)}%` : '-' },
  ]

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-amber-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Tax Summary Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">High-level consolidated tax data.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-600">{r.label}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {typeof r.value === 'string' ? r.value : `₹${formatCurrency(r.value)}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
