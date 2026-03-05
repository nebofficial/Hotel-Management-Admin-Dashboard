'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PackageCheck, AlertCircle } from 'lucide-react'

export default function PartialDeliverySupport({ items = [], receivedItems = [], onReceivedChange }) {
  const updateReceived = (index, quantityReceived) => {
    const updated = [...receivedItems]
    const item = items[index]
    const existing = updated.find((r) => r.itemId === item.itemId || r.name === item.name)
    
    if (existing) {
      existing.quantityReceived = Number(quantityReceived) || 0
    } else {
      updated.push({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        quantityReceived: Number(quantityReceived) || 0,
        price: item.price,
      })
    }
    onReceivedChange?.(updated)
  }

  const getReceivedQty = (item) => {
    const received = receivedItems.find((r) => r.itemId === item.itemId || r.name === item.name)
    return Number(received?.quantityReceived || 0)
  }

  const isFullyReceived = (item) => {
    const received = getReceivedQty(item)
    return received >= Number(item.quantity || 0)
  }

  const isPartiallyReceived = (item) => {
    const received = getReceivedQty(item)
    return received > 0 && received < Number(item.quantity || 0)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <PackageCheck className="h-5 w-5 text-amber-600" />
          Partial Delivery Support
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No items in this order.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const received = getReceivedQty(item)
              const pending = Number(item.quantity || 0) - received
              return (
                <div
                  key={index}
                  className={`rounded-md border p-3 ${
                    isFullyReceived(item)
                      ? 'bg-green-50 border-green-200'
                      : isPartiallyReceived(item)
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-600">
                        Ordered: {Number(item.quantity || 0)} {item.unit || ''}
                      </p>
                    </div>
                    {isFullyReceived(item) && (
                      <div className="flex items-center gap-1 text-green-600">
                        <PackageCheck className="h-4 w-4" />
                        <span className="text-xs font-medium">Fully Received</span>
                      </div>
                    )}
                    {isPartiallyReceived(item) && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Partial</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Received Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        step="0.01"
                        value={received}
                        onChange={(e) => updateReceived(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Pending</Label>
                      <Input
                        value={pending}
                        readOnly
                        className="text-sm bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
