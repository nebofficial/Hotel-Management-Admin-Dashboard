'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Package, TrendingUp } from 'lucide-react'

export default function TotalItemsOverview({ totalItems = 0, change = 0 }) {
  const isPositive = change >= 0

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Items</p>
            <p className="text-4xl font-bold">{totalItems.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-green-300' : 'text-red-300'}`} />
              <span className={`text-sm font-medium ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                {isPositive ? '+' : ''}{change} this month
              </span>
            </div>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <Package className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
