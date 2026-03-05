'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CorporateBillingStats({ summary }) {
  const {
    totalClients = 0,
    monthlyRevenue = 0,
    outstanding = 0,
    utilization = 0,
  } = summary || {}

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      Number(v || 0),
    )

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-gradient-to-br from-emerald-500/80 to-teal-500 text-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Corporate Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-sky-500/80 to-blue-500 text-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Corporate Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{formatCurrency(monthlyRevenue)}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-rose-500/80 to-red-500 text-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{formatCurrency(outstanding)}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-500/80 to-yellow-500 text-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Credit Limit Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{utilization.toFixed ? utilization.toFixed(0) : utilization}%</div>
        </CardContent>
      </Card>
    </div>
  )
}

