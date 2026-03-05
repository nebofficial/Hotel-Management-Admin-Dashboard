'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function GraphicalReports({ revenueByDay, expenseByCategory, byMonth }) {
  const lineData = (revenueByDay || []).slice(-30).map((d) => ({ date: d.date?.slice(5) || d.date, revenue: d.value }))
  const barData = expenseByCategory ? Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })) : []
  const pieData = byMonth?.length
    ? byMonth.slice(-6).map((m, i) => ({ name: m.month, value: Number(m.revenue ?? 0) })).filter((d) => d.value > 0)
    : []

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-indigo-900 text-base">
          <TrendingUp className="h-5 w-5" />
          Graphical Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {lineData.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Revenue Trend (Last 30 days)</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {barData.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Expense by Category</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, '']} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {pieData.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Revenue by Month (Pie)</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="month">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {!lineData.length && !barData.length && !pieData.length && (
          <p className="text-sm text-gray-500 py-6 text-center">No chart data available yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
