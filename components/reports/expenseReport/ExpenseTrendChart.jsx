'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6']

export function ExpenseTrendChart({ trend = [], categoryDistribution = [], departmentExpenses = [], loading }) {
  const lineData = (trend || []).map((d) => ({
    date: d.date?.slice(5) || d.date,
    total: d.total ?? 0,
  }))
  const pieData = (categoryDistribution || []).filter((d) => (d.value || 0) > 0)
  const barData = departmentExpenses || []

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-red-500/5 to-rose-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Monthly Expense Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          {loading || !lineData.length ? (
            <p className="text-xs text-slate-500 text-center py-8">No trend data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v?.toLocaleString?.() ?? v)} />
                <Tooltip formatter={(v) => (v?.toLocaleString?.('en-IN') ?? v)} />
                <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} dot={false} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {barData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Department Expense Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v?.toLocaleString?.() ?? v)} />
                <Tooltip formatter={(v) => (v?.toLocaleString?.('en-IN') ?? v)} />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Expense Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  paddingAngle={2}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => (v?.toLocaleString?.('en-IN') ?? v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
