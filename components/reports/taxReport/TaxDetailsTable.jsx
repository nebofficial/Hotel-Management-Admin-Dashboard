'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function TaxDetailsTable({ breakdown = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-800">Detailed Tax Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : breakdown.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Invoice</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Customer</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Tax</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Service Chg</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Total</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium">{row.invoiceNumber || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{row.customerName || '-'}</td>
                  <td className="py-2 px-3 text-right">₹{formatCurrency(row.taxAmount)}</td>
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
