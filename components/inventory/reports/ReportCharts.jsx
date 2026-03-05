'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

export default function ReportCharts({ stockData, movementData }) {
  const stockChartData = stockData?.byCategory ? Object.entries(stockData.byCategory).map(([name, vals]) => ({ name, quantity: vals.quantity, value: vals.value })) : []

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <TrendingUp className="h-5 w-5" />
          Graphical Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stockChartData.length > 0 && (
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Stock by Category</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#6366f1" name="Quantity" />
                <Bar dataKey="value" fill="#8b5cf6" name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
