'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function RecentFinancialActivity({ recentActivity }) {
  const list = recentActivity || []

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-900 text-base">Recent Financial Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
          {list.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No recent transactions.</p>
          ) : (
            list.map((item) => (
              <div
                key={`${item.type}-${item.id}-${item.date}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/80 hover:bg-white border border-amber-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {item.type === 'income' ? (
                      <ArrowDownRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.description || item.source}</p>
                    <p className="text-xs text-gray-500">
                      {item.source} · {item.date ? new Date(item.date).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${item.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                  {item.type === 'income' ? '+' : '-'}${Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
