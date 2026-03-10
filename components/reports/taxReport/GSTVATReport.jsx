'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function GSTVATReport({ data, loading }) {
  const { invoiceCount = 0, totalTaxAmount = 0, taxableSales = 0, gstBreakdown = {} } = data || {}

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          GST / VAT Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">Tax collected under GST / VAT. Helps track tax compliance.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Invoice Count</p>
              <p className="text-lg font-semibold text-slate-800">{invoiceCount}</p>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Total Tax Amount</p>
              <p className="text-lg font-semibold text-blue-600">₹{formatCurrency(totalTaxAmount)}</p>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Taxable Sales</p>
              <p className="text-lg font-semibold text-slate-800">₹{formatCurrency(taxableSales)}</p>
            </div>
          </div>
        )}
        {(gstBreakdown?.cgst > 0 || gstBreakdown?.sgst > 0 || gstBreakdown?.igst > 0) && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs">
            <div>CGST: ₹{formatCurrency(gstBreakdown.cgst || 0)}</div>
            <div>SGST: ₹{formatCurrency(gstBreakdown.sgst || 0)}</div>
            <div>IGST: ₹{formatCurrency(gstBreakdown.igst || 0)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
