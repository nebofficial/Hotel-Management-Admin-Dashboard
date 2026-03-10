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

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']

export function TaxTrendChart({ trend = [], taxDistribution = [], loading }) {
  const lineData = (trend || []).map((d) => ({
    date: d.date?.slice(5) || d.date,
    tax: d.tax ?? 0,
    serviceCharge: d.serviceCharge ?? 0,
    total: d.total ?? (d.tax || 0) + (d.serviceCharge || 0),
  }))
  const pieData = (taxDistribution || []).filter((d) => (d.value || 0) > 0)

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Monthly Tax Collection Trend</CardTitle>
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
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total" />
                <Line type="monotone" dataKey="tax" stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="GST/VAT" />
                <Line type="monotone" dataKey="serviceCharge" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Service Chg" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Tax Distribution by Type</CardTitle>
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

      {lineData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Taxable Revenue (Daily Total Tax)</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v?.toLocaleString?.() ?? v)} />
                <Tooltip formatter={(v) => (v?.toLocaleString?.('en-IN') ?? v)} />
                <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Total Tax" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
