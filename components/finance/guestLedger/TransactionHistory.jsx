'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { List } from 'lucide-react'

export default function TransactionHistory({ transactions }) {
  const rows = transactions || []

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-2 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-b">
        <CardTitle className="text-purple-900 text-base flex items-center gap-2">
          <List className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b">
              <tr>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Date</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Debit</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Credit</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => (
                <tr key={t.id || i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-600">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{t.description || t.type || '-'}</td>
                  <td className="py-2 px-3 text-right font-medium text-red-700">{t.isDebit ? `$${Number(t.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td className="py-2 px-3 text-right font-medium text-green-700">{!t.isDebit ? `$${Number(t.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td className="py-2 px-3 text-right font-medium text-gray-900">${Number(t.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="text-sm text-gray-500 py-6 text-center">No transactions</p>}
        </div>
      </CardContent>
    </Card>
  )
}
