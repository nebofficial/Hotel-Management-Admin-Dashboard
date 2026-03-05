'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Package, AlertTriangle, TrendingUp } from 'lucide-react'

export default function ViewItemStock({ currentStock = 0, reorderLevel = 0, unit = '' }) {
  const isLow = currentStock < reorderLevel
  const isMedium = currentStock >= reorderLevel && currentStock < reorderLevel * 2
  const statusColor = isLow ? 'from-red-500 to-red-600' : isMedium ? 'from-orange-500 to-orange-600' : 'from-green-500 to-green-600'

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${statusColor} text-white`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-medium mb-1">Current Stock</p>
            <p className="text-4xl font-bold">
              {Number(currentStock).toLocaleString()} {unit}
            </p>
            {isLow && (
              <div className="flex items-center gap-1 mt-2 text-red-100">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Below reorder level!</span>
              </div>
            )}
            {isMedium && (
              <div className="flex items-center gap-1 mt-2 text-orange-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Medium stock</span>
              </div>
            )}
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <Package className="h-8 w-8" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/80">Reorder Level: {Number(reorderLevel).toLocaleString()} {unit}</p>
        </div>
      </CardContent>
    </Card>
  )
}
