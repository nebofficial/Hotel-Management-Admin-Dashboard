'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#4f46e5', '#0ea5e9', '#22c55e', '#f97316', '#ec4899', '#64748b']

export function OTABookingInsights({ channels = [] }) {
  const data = channels.filter((c) => (c.bookings || 0) > 0)

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-red-400/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">OTA Booking Insights</CardTitle>
        <p className="text-[11px] text-slate-600">
          Distribution of bookings across OTA channels and direct sources.
        </p>
      </CardHeader>
      <CardContent className="p-4 h-56">
        {data.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No OTA channel data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="bookings"
                nameKey="channel"
                cx="50%"
                cy="50%"
                outerRadius={70}
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.channel}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name, entry) =>
                  `${entry.payload.bookings?.toLocaleString('en-IN') || 0} bookings`
                }
              />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconSize={8}
                wrapperStyle={{ fontSize: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

