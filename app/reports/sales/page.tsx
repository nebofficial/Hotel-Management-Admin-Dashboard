'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RestaurantSalesPage() {
  const data = [
    { day: 'Mon', sales: 4200 },
    { day: 'Tue', sales: 3800 },
    { day: 'Wed', sales: 5200 },
    { day: 'Thu', sales: 4800 },
    { day: 'Fri', sales: 6200 },
    { day: 'Sat', sales: 7100 },
    { day: 'Sun', sales: 5900 },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Restaurant Sales Report</h1>
          <p className="text-xs text-gray-500 mt-0.5">Weekly sales analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Sales</p>
              <div className="text-2xl font-bold text-gray-900">$37,200</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Avg Daily Sales</p>
              <div className="text-2xl font-bold text-gray-900">$5,314</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Transactions</p>
              <div className="text-2xl font-bold text-gray-900">456</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Daily Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={35} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="sales" stroke="#dc2626" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
