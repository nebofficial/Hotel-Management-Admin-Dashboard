'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function RevenueByRoomCategory({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-slate-50">
        <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Room Category</CardTitle>
        <p className="text-[11px] text-slate-600">
          Compare revenue contribution of each room category.
        </p>
      </CardHeader>
      <CardContent className="p-4 h-60">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="roomType" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              />
              <Tooltip
                formatter={(v) =>
                  typeof v === 'number'
                    ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
                    : v
                }
              />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No revenue by room category data for this period.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

