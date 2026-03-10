'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const PIE_COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed']

export function RevenueTrendChart({ trend = [], roomTypeRevenue = [], loading }) {
  const lineData = (trend || []).map((d) => ({ date: d.date?.slice(5) || d.date, revenue: d.revenue }))
  const barData = roomTypeRevenue || []
  const pieData = barData.filter((d) => (d.value || 0) > 0)

  return (
    <div className="space-y-3">
      <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-red-50 to-rose-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Revenue Trend (Line)</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          {loading || !lineData.length ? (
            <p className="text-xs text-slate-500 text-center py-8">No trend data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v?.toLocaleString?.() ?? v} />
                <Tooltip formatter={(v) => v?.toLocaleString?.('en-IN') ?? v} />
                <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Room Type (Bar)</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          {loading || !barData.length ? (
            <p className="text-xs text-slate-500 text-center py-6">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v?.toLocaleString?.() ?? v} />
                <Tooltip formatter={(v) => v?.toLocaleString?.('en-IN') ?? v} />
                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Revenue Distribution (Pie)</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => v?.toLocaleString?.('en-IN') ?? v} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
