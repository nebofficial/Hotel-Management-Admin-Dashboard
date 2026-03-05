'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function BillingOverviewChart({ revenue = {} }) {
  const {
    roomRevenue = 0,
    restaurantRevenue = 0,
    otherCharges = 0,
    refunds = 0,
  } = revenue

  const data = [
    { name: 'Room Revenue', value: Number(roomRevenue), fill: '#8b5cf6' },
    { name: 'Restaurant', value: Number(restaurantRevenue), fill: '#a78bfa' },
    { name: 'Other Charges', value: Number(otherCharges), fill: '#c4b5fd' },
    { name: 'Refunds', value: -Math.abs(Number(refunds)), fill: '#f87171' },
  ]

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-violet-900">Revenue Overview</CardTitle>
        <p className="text-xs text-violet-600">Room, Restaurant, Other Charges & Refunds</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6d28d9' }} />
            <YAxis tick={{ fontSize: 11 }} width={45} tickFormatter={(v) => v >= 0 ? `₹${v}` : `-₹${Math.abs(v)}`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #c4b5fd' }}
              formatter={(v) => ['₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }), '']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
