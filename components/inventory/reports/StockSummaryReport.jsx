'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'

export default function StockSummaryReport({ data }) {
  const stats = [
    { label: 'Total Items', value: data?.totalItems || 0, icon: Package, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600' },
    { label: 'Total Quantity', value: data?.totalQuantity || 0, icon: TrendingUp, color: 'from-green-500 to-green-600', textColor: 'text-green-600' },
    { label: 'Total Value', value: `$${(data?.totalValue || 0).toFixed(2)}`, icon: DollarSign, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-600' },
    { label: 'Low Stock Items', value: data?.lowStock || 0, icon: AlertTriangle, color: 'from-red-500 to-red-600', textColor: 'text-red-600' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Stock Summary Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className={`bg-gradient-to-br ${stat.color} p-4`}>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </div>
            </Card>
          )
        })}
      </div>
      {data?.byCategory && Object.keys(data.byCategory).length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-base">By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.byCategory).map(([cat, vals]) => (
                <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">{vals.count} items</span>
                    <span className="text-gray-600">{vals.quantity} units</span>
                    <span className="text-green-600 font-semibold">${vals.value.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
