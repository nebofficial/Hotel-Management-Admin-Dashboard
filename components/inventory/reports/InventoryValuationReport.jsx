'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function InventoryValuationReport({ data }) {
  const chartData = data?.byCategory ? Object.entries(data.byCategory).map(([name, value]) => ({ name, value })) : []

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-900">
          <DollarSign className="h-5 w-5" />
          Inventory Valuation Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-600 mb-1">Total Inventory Worth</p>
          <p className="text-3xl font-bold text-teal-600">${(data?.totalValue || 0).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{data?.itemCount || 0} items</p>
        </div>
        {chartData.length > 0 && (
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Category-wise Valuation</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
