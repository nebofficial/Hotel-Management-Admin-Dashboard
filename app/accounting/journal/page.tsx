'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function JournalEntriesPage() {
  const entries = [
    { id: 1, date: '2024-01-20', refNo: 'JE-001', description: 'Room Revenue', debit: '$2,500', credit: '-', status: 'Posted' },
    { id: 2, date: '2024-01-20', refNo: 'JE-002', description: 'Utilities Expense', debit: '-', credit: '$800', status: 'Posted' },
    { id: 3, date: '2024-01-19', refNo: 'JE-003', description: 'Staff Salary', debit: '-', credit: '$3,200', status: 'Posted' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Journal Entries</h1>
            <p className="text-xs text-gray-500 mt-0.5">Record all accounting transactions</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            New Entry
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Ref No</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Debit</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Credit</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-700">{entry.date}</td>
                      <td className="py-2 px-2 text-gray-900 font-medium">{entry.refNo}</td>
                      <td className="py-2 px-2 text-gray-700">{entry.description}</td>
                      <td className="py-2 px-2 text-right font-medium">{entry.debit}</td>
                      <td className="py-2 px-2 text-right font-medium">{entry.credit}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                          {entry.status}
                        </span>
                      </td>
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
