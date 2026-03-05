'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'

export default function PayrollPage() {
  const payroll = [
    { id: 1, month: 'January 2024', staffCount: '25', totalSalary: '$45,600', status: 'Paid', date: '2024-01-31' },
    { id: 2, month: 'December 2023', staffCount: '25', totalSalary: '$45,200', status: 'Paid', date: '2023-12-31' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Payroll</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage staff payroll and salaries</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            Process Payroll
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Month</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Staff</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Total Salary</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Date</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{entry.month}</td>
                      <td className="py-2 px-2 text-center">{entry.staffCount}</td>
                      <td className="py-2 px-2 text-right font-bold">{entry.totalSalary}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-gray-700">{entry.date}</td>
                      <td className="py-2 px-2 text-center">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
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
