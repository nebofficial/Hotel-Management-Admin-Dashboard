'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function VendorPaymentsReport({ vendorPayments = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Vendor Payments
        </CardTitle>
        <p className="text-[11px] text-slate-500">Payments made to vendors. Useful for vendor management.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : vendorPayments.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No vendor payments</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-100/80 border-b border-orange-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Vendor</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Invoice / Ref</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Amount</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {vendorPayments.slice(0, 25).map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-orange-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.vendorName || '-'}</td>
                  <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]">{row.invoiceNumber || '-'}</td>
                  <td className="py-2 px-3 text-right font-semibold text-orange-700">₹{formatCurrency(row.paymentAmount)}</td>
                  <td className="py-2 px-3 text-center text-slate-500">{row.paymentDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
