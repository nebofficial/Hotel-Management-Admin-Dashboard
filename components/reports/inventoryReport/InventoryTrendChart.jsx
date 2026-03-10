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

export function InventoryTrendChart({ trend = [], categoryDistribution = [], loading }) {
  const lineData = (trend || []).map((d) => ({
    date: d.date?.slice(5) || d.date,
    stockIn: d.stockIn ?? 0,
    stockOut: d.stockOut ?? 0,
  }))
  const pieData = (categoryDistribution || []).filter((d) => (d.value || 0) > 0)

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Stock Usage Trend</CardTitle>
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
                <Line type="monotone" dataKey="stockIn" stroke="#22c55e" strokeWidth={2} dot={false} name="Stock In" />
                <Line type="monotone" dataKey="stockOut" stroke="#ef4444" strokeWidth={2} dot={false} name="Stock Out" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Inventory Distribution</CardTitle>
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

      {pieData.length > 0 && (
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Category Consumption</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v?.toLocaleString?.() ?? v)} />
                <Tooltip formatter={(v) => (v?.toLocaleString?.('en-IN') ?? v)} />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} name="Qty" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
