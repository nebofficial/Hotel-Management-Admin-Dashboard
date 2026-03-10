'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function BookingPerformanceAnalytics({ summary, dailyTrend }) {
  const hasData = Array.isArray(dailyTrend) && dailyTrend.length > 0

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-fuchsia-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-purple-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Booking Performance</CardTitle>
        <p className="text-[11px] text-slate-600">
          Booking volume and revenue trend for the selected period.
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3 text-[11px]">
          <div>
            <p className="text-slate-500">Total Bookings</p>
            <p className="text-base font-semibold text-slate-900">
              {summary?.totalBookings?.toLocaleString('en-IN') || 0}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Total Revenue</p>
            <p className="text-base font-semibold text-slate-900">
              ₹{' '}
              {summary?.totalRevenue?.toLocaleString('en-IN', {
                maximumFractionDigits: 0,
              }) || 0}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Avg. Booking Value</p>
            <p className="text-base font-semibold text-slate-900">
              ₹{' '}
              {summary?.averageRoomRate?.toLocaleString('en-IN', {
                maximumFractionDigits: 0,
              }) || 0}
            </p>
          </div>
        </div>

        <div className="h-40">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.toLocaleString('en-IN')}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.toLocaleString('en-IN')}
                />
                <Tooltip
                  formatter={(v) =>
                    typeof v === 'number'
                      ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
                      : v
                  }
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  name="Bookings"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No booking trend data for this period.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

