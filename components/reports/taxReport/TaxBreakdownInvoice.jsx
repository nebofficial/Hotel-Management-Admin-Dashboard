'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function TaxBreakdownInvoice({ breakdown = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-400/10 via-yellow-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-amber-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Tax Breakdown by Invoice
        </CardTitle>
        <p className="text-[11px] text-slate-500">Transparent invoice-level tax details.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : breakdown.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No invoice data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-amber-100/80 border-b border-amber-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Invoice</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Customer</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Source</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Tax</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Service Chg</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Total</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.slice(0, 50).map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-amber-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.invoiceNumber || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{row.customerName || '-'}</td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{row.source || '-'}</span>
                  </td>
                  <td className="py-2 px-3 text-right font-medium">₹{formatCurrency(row.taxAmount)}</td>
                  <td className="py-2 px-3 text-right">₹{formatCurrency(row.serviceCharge)}</td>
                  <td className="py-2 px-3 text-right font-semibold">₹{formatCurrency(row.grandTotal)}</td>
                  <td className="py-2 px-3 text-center text-slate-500">{row.date || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
