'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ReservationOverviewChart({ chartData = [] }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-violet-900">Reservation Overview</CardTitle>
        <p className="text-xs text-violet-600">Bookings trend (last 14 days)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6d28d9' }} />
            <YAxis tick={{ fontSize: 11 }} width={35} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #c4b5fd' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="total" stroke="#7c3aed" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

