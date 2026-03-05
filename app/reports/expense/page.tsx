'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function ExpenseReportPage() {
  const data = [
    { name: 'Salary', value: 5600 },
    { name: 'Utilities', value: 2200 },
    { name: 'Maintenance', value: 1800 },
    { name: 'Supplies', value: 1500 },
    { name: 'Other', value: 1700 },
  ]

  const colors = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#06b6d4']

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Expense Report</h1>
          <p className="text-xs text-gray-500 mt-0.5">Monthly expense breakdown</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Expenses</p>
              <div className="text-2xl font-bold text-red-600">-$12,800</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Expense Ratio</p>
              <div className="text-2xl font-bold text-gray-900">28%</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} label={{ fontSize: 11 }} outerRadius={70} fill="#dc2626" dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
