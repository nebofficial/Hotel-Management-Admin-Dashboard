'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function MonthlyStockComparison({ currentMonth = [], previousMonth = [] }) {
  const comparisonData = currentMonth.map((item, index) => {
    const prev = previousMonth[index] || { value: 0 }
    const change = item.value - prev.value
    const changePercent = prev.value > 0 ? ((change / prev.value) * 100).toFixed(1) : 0
    return {
      name: item.name,
      current: item.value,
      previous: prev.value,
      change: changePercent,
    }
  })

  if (comparisonData.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardTitle className="text-gray-800">Monthly Stock Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-8">No comparison data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardTitle className="text-gray-800">Monthly Stock Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="previous" fill="#94a3b8" name="Previous Month" radius={[8, 8, 0, 0]} />
            <Bar dataKey="current" fill="#06b6d4" name="Current Month" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {comparisonData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <div className="flex items-center gap-2">
                {item.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : item.change < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
