'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PurchaseReport({ data }) {
  const chartData = data?.byMonth ? Object.entries(data.byMonth).map(([month, amount]) => ({ month, amount })) : []

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <ShoppingCart className="h-5 w-5" />
          Purchase Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-green-600">{data?.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">${(data?.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>
        {chartData.length > 0 && (
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Monthly Purchase Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
