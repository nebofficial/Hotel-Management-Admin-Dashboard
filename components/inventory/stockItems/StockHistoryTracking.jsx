'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History, ArrowDown, ArrowUp, RotateCcw } from 'lucide-react'

export default function StockHistoryTracking({ history = [], loading = false }) {
  const getIcon = (type) => {
    switch (type) {
      case 'IN':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'OUT':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      case 'ADJUSTMENT':
        return <RotateCcw className="h-4 w-4 text-blue-600" />
      default:
        return <History className="h-4 w-4 text-slate-600" />
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'IN':
        return 'bg-green-50 border-green-200'
      case 'OUT':
        return 'bg-red-50 border-red-200'
      case 'ADJUSTMENT':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <History className="h-5 w-5 text-slate-600" />
          Stock History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-sm text-slate-500 text-center py-4">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No stock history available.</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 rounded-md border p-3 ${getColor(entry.movementType)}`}
              >
                {getIcon(entry.movementType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 capitalize">{entry.movementType}</p>
                  <p className="text-xs text-slate-600">
                    {entry.previousStock} → {entry.newStock} {entry.quantity ? `(${entry.quantity > 0 ? '+' : ''}${entry.quantity})` : ''}
                  </p>
                  {entry.notes && <p className="text-xs text-slate-500 mt-0.5">{entry.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                  </p>
                  <p className="text-xs text-slate-400">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
