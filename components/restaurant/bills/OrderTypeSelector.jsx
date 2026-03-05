'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UtensilsCrossed, ShoppingBag, Truck } from 'lucide-react'

const ORDER_TYPES = [
  { value: 'Dine-in', label: 'Dine-in', icon: UtensilsCrossed },
  { value: 'Takeaway', label: 'Takeaway', icon: ShoppingBag },
  { value: 'Delivery', label: 'Delivery', icon: Truck },
]

export default function OrderTypeSelector({ value, onChange }) {
  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800">Order Type</h3>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="flex gap-2">
          {ORDER_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange?.(t.value)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                value === t.value
                  ? 'border-blue-600 bg-blue-100 text-blue-800'
                  : 'border-slate-200 bg-white hover:border-blue-300 text-slate-600'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
