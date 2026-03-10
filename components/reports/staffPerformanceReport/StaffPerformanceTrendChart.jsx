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

const PIE_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444']

export function StaffPerformanceTrendChart({ attendanceTrend = [], departmentPerformance = [], loading }) {
  const lineData = (attendanceTrend || []).map((d) => ({
    date: d.date?.slice(5) || d.date,
    rate: d.attendanceRate ?? d.rate ?? 0,
  }))
  const pieData = (departmentPerformance || []).map((d) => ({
    name: d.department,
    value: d.totalSales ?? 0,
  }))

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          {loading || !lineData.length ? (
            <p className="text-xs text-slate-500 text-center py-8">No attendance trend data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v ?? 0}%`} />
                <Tooltip formatter={(v) => `${v ?? 0}%`} />
                <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Department Performance</CardTitle>
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

