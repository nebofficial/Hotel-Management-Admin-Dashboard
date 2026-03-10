'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

export function OccupancyChartPanel({ daily = [], roomTypeOccupancy = [], loading }) {
  const lineData = (daily || []).map((d) => ({ date: d.date?.slice(5) || d.date, occupancyRate: d.occupancyPercentage }))
  const barData = (roomTypeOccupancy || []).map((r) => ({ name: r.roomType, value: r.occupancyPercentage }))
  const pieData = barData.filter((d) => d.value > 0)

  return (
    <div className="space-y-3">
      <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-red-50 to-rose-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Occupancy Trend (Line)</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          {loading || !lineData.length ? (
            <p className="text-xs text-slate-500 text-center py-8">No trend data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Line type="monotone" dataKey="occupancyRate" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Room Type Occupancy (Bar)</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          {loading || !barData.length ? (
            <p className="text-xs text-slate-500 text-center py-6">No room type data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <XAxis type="number" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Occupancy Distribution (Pie)</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
