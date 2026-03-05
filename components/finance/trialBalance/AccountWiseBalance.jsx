'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function AccountWiseBalance({ rows = [], totalDebit = 0, totalCredit = 0 }) {
  const fmt = (n) =>
    n > 0
      ? '\u20B9' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '-'

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Debit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Credit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-4 text-gray-700">{r.code || '-'}</td>
                  <td className="py-2.5 px-4 text-gray-900 font-medium">{r.name || '-'}</td>
                  <td className="py-2.5 px-4 text-right font-medium">{fmt(r.debit)}</td>
                  <td className="py-2.5 px-4 text-right font-medium">{fmt(r.credit)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No accounts with balances for the selected date.
                  </td>
                </tr>
              )}
              {rows.length > 0 && (
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                  <td colSpan={2} className="py-3 px-4 text-gray-900">Total</td>
                  <td className="py-3 px-4 text-right">{fmt(totalDebit)}</td>
                  <td className="py-3 px-4 text-right">{fmt(totalCredit)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
