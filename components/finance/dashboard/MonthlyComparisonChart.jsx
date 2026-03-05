'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MonthlyComparisonChart({ byMonth, selectedMonth, onMonthChange }) {
  const chartData = (byMonth || []).map((m) => ({
    month: m.month,
    revenue: Number(m.revenue ?? 0),
    expenses: Number(m.expenses ?? 0),
  }))

  const months = chartData.map((m) => m.month)
  const current = selectedMonth || (months.length ? months[months.length - 1] : '')

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-200">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-purple-900 text-base">Monthly Comparison</CardTitle>
        {months.length > 0 && (
          <select
            value={current}
            onChange={(e) => onMonthChange(e.target.value)}
            className="rounded-lg border border-purple-300 bg-white px-3 py-1.5 text-sm text-gray-700"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#e11d48" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-8 text-center">No monthly data yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
