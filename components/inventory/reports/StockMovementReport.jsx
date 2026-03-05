'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StockMovementReport({ data }) {
  const chartData = [
    { name: 'Inward', value: data?.inward || 0 },
    { name: 'Outward', value: data?.outward || 0 },
  ]

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <RefreshCw className="h-5 w-5" />
          Stock Movement Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <ArrowDownCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Inward</p>
            <p className="text-xl font-bold text-green-600">{data?.inward || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <ArrowUpCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Outward</p>
            <p className="text-xl font-bold text-red-600">{data?.outward || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <RefreshCw className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Adjustments</p>
            <p className="text-xl font-bold text-blue-600">{data?.adjustments || 0}</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
