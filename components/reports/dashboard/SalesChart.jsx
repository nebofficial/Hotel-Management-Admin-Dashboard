'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#6366f1', '#f97316', '#22c55e', '#e11d48', '#0ea5e9', '#a855f7']

export function SalesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-800">Sales Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="text-[11px] text-slate-500 py-6 text-center">
          No sales breakdown data available.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-slate-800">Sales Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

