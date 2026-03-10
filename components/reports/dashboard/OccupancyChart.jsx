'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function OccupancyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-800">Occupancy Rate</CardTitle>
        </CardHeader>
        <CardContent className="text-[11px] text-slate-500 py-6 text-center">
          No occupancy data available in this period.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-slate-800">Occupancy Rate</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              formatter={(v) => `${Number(v).toFixed(1)}%`}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="occupancyRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

