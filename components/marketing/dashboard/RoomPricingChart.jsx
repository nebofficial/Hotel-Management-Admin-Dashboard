'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function RoomPricingChart({ dailyTrend = [] }) {
  const hasData = Array.isArray(dailyTrend) && dailyTrend.length > 0

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-slate-50">
        <CardTitle className="text-sm font-semibold text-slate-800">Room Pricing Trend</CardTitle>
        <p className="text-[11px] text-slate-600">
          Daily bookings and revenue, useful to validate pricing decisions.
        </p>
      </CardHeader>
      <CardContent className="p-4 h-60">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              />
              <Tooltip
                formatter={(v, name) =>
                  typeof v === 'number'
                    ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
                    : v
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No pricing trend data available for this period.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

