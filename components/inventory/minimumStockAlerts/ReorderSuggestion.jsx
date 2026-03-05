'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Package } from 'lucide-react'

export default function ReorderSuggestion({ item }) {
  if (!item) return null

  const currentStock = Number(item.currentStock || 0)
  const reorderLevel = Number(item.reorderLevel || 0)
  const deficit = Math.max(0, reorderLevel - currentStock)
  const suggested = Math.ceil(deficit + reorderLevel * 0.5)

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900 text-base">
          <TrendingUp className="h-5 w-5" />
          Reorder Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Item</span>
            <span className="font-semibold text-gray-900">{item.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Current Stock</span>
            <span className="font-semibold text-red-600">{currentStock} {item.unit || ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Reorder Level</span>
            <span className="font-semibold text-gray-900">{reorderLevel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Deficit</span>
            <span className="font-semibold text-orange-600">{deficit}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center gap-2 justify-between bg-green-100 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-700" />
                <span className="text-sm font-medium text-green-900">Suggested Reorder</span>
              </div>
              <span className="text-2xl font-bold text-green-700">{suggested}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
