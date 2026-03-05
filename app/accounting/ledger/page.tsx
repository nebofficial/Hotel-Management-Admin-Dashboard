'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Filter } from 'lucide-react'

export default function CashBankLedgerPage() {
  const entries = [
    { id: 1, date: '2024-01-20', type: 'Deposit', description: 'Room Revenue', amount: '$2,500', balance: '$128,800' },
    { id: 2, date: '2024-01-20', type: 'Withdrawal', description: 'Staff Salary', amount: '-$3,200', balance: '$125,600' },
    { id: 3, date: '2024-01-19', type: 'Deposit', description: 'Restaurant Sales', amount: '$1,800', balance: '$128,800' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Cash / Bank Ledger</h1>
            <p className="text-xs text-gray-500 mt-0.5">Monitor all cash and bank transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-xs gap-1.5 bg-transparent">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Button>
            <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
              <Plus className="w-3.5 h-3.5" />
              New Entry
            </Button>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Amount</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-700">{entry.date}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${entry.type === 'Deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-gray-700">{entry.description}</td>
                      <td className="py-2 px-2 text-right font-medium">{entry.amount}</td>
                      <td className="py-2 px-2 text-right font-medium text-gray-900">{entry.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
