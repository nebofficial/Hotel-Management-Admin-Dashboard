'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TransactionSearch from './TransactionSearch'
import TransactionDetailsModal from './TransactionDetailsModal'

export default function RecentTransactions({ transactions = [], onRefresh }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        (t.invoiceNumber || '').toLowerCase().includes(q) ||
        (t.guestName || '').toLowerCase().includes(q) ||
        (t.billType || '').toLowerCase().includes(q)
    )
  }, [transactions, search])

  const fmt = (n) =>
    '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const statusColor = (s) => {
    const m = { PAID: 'bg-emerald-100 text-emerald-700', Paid: 'bg-emerald-100 text-emerald-700', PENDING: 'bg-amber-100 text-amber-700', Pending: 'bg-amber-100 text-amber-700', OVERDUE: 'bg-red-100 text-red-700', Refunded: 'bg-gray-100 text-gray-600', Cancelled: 'bg-gray-100 text-gray-600' }
    return m[s] || 'bg-gray-100 text-gray-600'
  }

  return (
    <>
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200">
        <CardHeader className="pb-2 border-b border-amber-200/50 bg-amber-50/50">
          <CardTitle className="text-base text-amber-900">Recent Transactions</CardTitle>
          <div className="mt-2">
            <TransactionSearch value={search} onChange={setSearch} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-amber-100/80">
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-amber-900">Invoice #</th>
                  <th className="text-left py-2 px-3 font-semibold text-amber-900">Guest</th>
                  <th className="text-left py-2 px-3 font-semibold text-amber-900">Bill Type</th>
                  <th className="text-right py-2 px-3 font-semibold text-amber-900">Amount</th>
                  <th className="text-left py-2 px-3 font-semibold text-amber-900">Status</th>
                  <th className="text-left py-2 px-3 font-semibold text-amber-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id + (t.type || '')}
                    className="border-b border-amber-100 hover:bg-amber-50 cursor-pointer"
                    onClick={() => setSelected(t)}
                  >
                    <td className="py-2 px-3 text-gray-800">{t.invoiceNumber || '-'}</td>
                    <td className="py-2 px-3 text-gray-800">{t.guestName || '-'}</td>
                    <td className="py-2 px-3 text-gray-800">{t.billType || '-'}</td>
                    <td className="py-2 px-3 text-right font-medium">{fmt(t.amount)}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(t.paymentStatus)}`}>
                        {t.paymentStatus || '-'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {new Date(t.date || t.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="p-4 text-center text-gray-500 text-sm">No transactions found.</p>
          )}
        </CardContent>
      </Card>

      <TransactionDetailsModal
        open={!!selected}
        onClose={() => setSelected(null)}
        transaction={selected}
      />
    </>
  )
}
