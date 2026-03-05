'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function OutstandingTracker({ companies }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      Number(v || 0),
    )

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-rose-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-rose-700">Outstanding Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 text-xs font-medium text-rose-700">
          <div>Company</div>
          <div className="text-right">Total Invoice</div>
          <div className="text-right">Paid</div>
          <div className="text-right">Outstanding</div>
        </div>
        <div className="space-y-1 max-h-60 overflow-auto pr-1">
          {(companies || []).map((c) => (
            <div key={c.accountNumber} className="grid grid-cols-4 text-xs items-center border-b border-rose-100/60 py-1">
              <div className="truncate" title={c.companyName}>
                {c.companyName}
              </div>
              <div className="text-right">{formatCurrency(c.totalAmount)}</div>
              <div className="text-right">{formatCurrency(c.paidAmount)}</div>
              <div className={`text-right font-semibold ${c.outstanding > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {formatCurrency(c.outstanding)}
              </div>
            </div>
          ))}
          {!companies?.length && <div className="text-xs text-rose-500/80">No corporate outstanding yet.</div>}
        </div>
      </CardContent>
    </Card>
  )
}

