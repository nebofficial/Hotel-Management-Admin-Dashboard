'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const THRESHOLD_RATIO = 0.6

export default function ExpenseSummary({ data, totalRevenue }) {
  const total = data?.totalExpenses ?? 0
  const byCategory = data?.expenseByCategory
  const chartData = byCategory ? Object.entries(byCategory).map(([name, value]) => ({ name, value })) : []
  const overThreshold = totalRevenue > 0 && total / totalRevenue >= THRESHOLD_RATIO

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-red-900">
          <TrendingDown className="h-5 w-5" />
          Expense Summary
          {overThreshold && (
            <span className="ml-auto flex items-center gap-1 text-amber-600 text-sm font-medium">
              <AlertTriangle className="h-4 w-4" /> High
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-red-700">${Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        {chartData.length > 0 && (
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Amount']} />
                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {chartData.length === 0 && <p className="text-sm text-gray-500">No expense categories yet.</p>}
      </CardContent>
    </Card>
  )
}
