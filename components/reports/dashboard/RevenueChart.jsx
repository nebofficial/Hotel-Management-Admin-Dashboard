'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-800">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="text-[11px] text-slate-500 py-6 text-center">
          No revenue data available in this period.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-slate-800">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v.toLocaleString('en-IN')} />
            <Tooltip
              formatter={(v) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

