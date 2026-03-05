'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Package } from 'lucide-react'

export default function LowStockReport({ items }) {
  const lowStockItems = (items || []).filter((i) => Number(i.currentStock || 0) < Number(i.reorderLevel || 0))

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="h-5 w-5" />
          Low Stock Report
          <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">{lowStockItems.length} Critical</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length === 0 ? (
          <p className="text-gray-600 text-center py-4">All items are above minimum stock level</p>
        ) : (
          <div className="space-y-2">
            {lowStockItems.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-red-100">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{item.itemName}</p>
                    <p className="text-xs text-gray-500">{item.category || 'Uncategorized'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{item.currentStock || 0} units</p>
                  <p className="text-xs text-gray-500">Min: {item.reorderLevel || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
