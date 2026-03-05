'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownCircle, ArrowUpCircle, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function CashFlowSummary({ data }) {
  const revenue = data?.totalRevenue ?? 0
  const expenses = data?.totalExpenses ?? 0
  const net = (data?.netProfit ?? 0)
  const chartData = [
    { name: 'Inflow', value: revenue, fill: '#0d9488' },
    { name: 'Outflow', value: expenses, fill: '#dc2626' },
  ]

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-900 text-base">Cash Flow Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/80 rounded-lg p-2">
            <ArrowDownCircle className="h-6 w-6 text-teal-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Inflow</p>
            <p className="font-bold text-teal-700">${Number(revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <ArrowUpCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Outflow</p>
            <p className="font-bold text-red-700">${Number(expenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <Minus className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Net</p>
            <p className={`font-bold ${net >= 0 ? 'text-blue-700' : 'text-red-700'}`}>${Number(net).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
