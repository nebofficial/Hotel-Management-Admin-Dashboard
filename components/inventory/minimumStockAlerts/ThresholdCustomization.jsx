'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sliders } from 'lucide-react'

export default function ThresholdCustomization({ items }) {
  const byCategory = {}
  ;(items || []).forEach((i) => {
    const cat = i.category || 'Uncategorized'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(i)
  })

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Sliders className="h-5 w-5" />
          Threshold Summary by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(byCategory).map(([cat, catItems]) => {
            const low = catItems.filter((i) => Number(i.currentStock || 0) < Number(i.reorderLevel || 0)).length
            return (
              <div key={cat} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{cat}</span>
                  <span className="text-sm text-gray-600">{catItems.length} items</span>
                </div>
                {low > 0 && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{low} below threshold</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
