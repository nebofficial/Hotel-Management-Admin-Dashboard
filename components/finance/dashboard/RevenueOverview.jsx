'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueOverview({ data, revenueByDay }) {
  const total = data?.totalRevenue ?? 0
  const chartData = (revenueByDay || []).slice(-14).map((d) => ({ date: d.date?.slice(5) || d.date, value: d.value }))

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-green-900">
          <DollarSign className="h-5 w-5" />
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-green-700">${Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Total revenue
          </span>
        </div>
        {chartData.length > 0 && (
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
