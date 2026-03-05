'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Bell } from 'lucide-react'

export default function AutoLowStockAlerts({ lowStockItems, critical, warning, onNotify }) {
  return (
    <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(lowStockItems || []).length === 0 && (
            <p className="text-center text-gray-500 py-4">All items are above reorder level</p>
          )}
          {(lowStockItems || []).map((item) => {
            const isCritical = Number(item.currentStock || 0) <= Number(item.reorderLevel || 0) * 0.5
            return (
              <div key={item.id} className={`rounded-xl p-3 border-2 ${isCritical ? 'bg-red-100 border-red-300' : 'bg-orange-100 border-orange-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`font-semibold ${isCritical ? 'text-red-900' : 'text-orange-900'}`}>{item.name}</p>
                    <p className="text-sm text-gray-700">Stock: {item.currentStock || 0} / Reorder: {item.reorderLevel || 0}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onNotify(item)} className="border-red-400 text-red-700">
                    <Bell className="h-4 w-4 mr-1" /> Notify
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
