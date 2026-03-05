'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, CheckCircle2, Package } from 'lucide-react'

export default function AutoStockUpdate({ grn }) {
  if (!grn) return null

  const acceptedItems = Array.isArray(grn.receivedItems)
    ? grn.receivedItems.filter((item) => Number(item.acceptedQty || 0) > 0)
    : []

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <RefreshCw className="h-5 w-5" />
          Auto Stock Update Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Stock Update Status:</span>
              <div className="flex items-center gap-2">
                {grn.stockUpdated ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Updated</span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-gray-600">Pending</span>
                  </>
                )}
              </div>
            </div>
            {grn.stockUpdatedAt && (
              <p className="text-xs text-gray-500">
                Updated at: {new Date(grn.stockUpdatedAt).toLocaleString()}
              </p>
            )}
          </div>

          {acceptedItems.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Items to be Added:</h4>
              <div className="space-y-2">
                {acceptedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.itemName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Current Stock</span>
                      <span className="font-medium text-gray-900">→</span>
                      <span className="font-semibold text-green-600">
                        +{item.acceptedQty} {item.unit || ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {grn.stockUpdated && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">
                  Stock has been automatically updated in inventory
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
