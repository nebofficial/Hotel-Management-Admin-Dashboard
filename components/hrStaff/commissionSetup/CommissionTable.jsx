'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CommissionTable({ transactions = [], onPayout }) {
  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-rose-50 to-red-50">
        <CardTitle className="text-sm font-semibold text-slate-900">Commission Transactions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No commission transactions yet. Calculate commission from the billing modules to see data here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-600">
                  <th className="py-2 px-2 text-left">Staff</th>
                  <th className="py-2 px-2 text-left">Service</th>
                  <th className="py-2 px-2 text-right">Base Amount</th>
                  <th className="py-2 px-2 text-right">Commission</th>
                  <th className="py-2 px-2 text-center">Status</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="py-2 px-2 font-medium text-slate-900">{t.staffName}</td>
                    <td className="py-2 px-2 text-[11px] text-slate-600">{t.serviceType}</td>
                    <td className="py-2 px-2 text-right">{Number(t.baseAmount || 0).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-semibold">{Number(t.commissionAmount || 0).toLocaleString()}</td>
                    <td className="py-2 px-2 text-center">
                      <Badge
                        className={
                          t.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : t.status === 'overdue'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 text-right">
                      {t.status !== 'paid' && (
                        <button
                          type="button"
                          className="text-[10px] text-emerald-600 hover:underline"
                          onClick={() => onPayout?.(t.id)}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

