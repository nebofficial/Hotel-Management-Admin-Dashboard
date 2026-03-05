'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Banknote, CreditCard, Smartphone, Landmark } from 'lucide-react'

const MODES = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'bank', label: 'Bank Transfer', icon: Landmark },
]

export default function RefundModeSelector({ value, onChange }) {
  return (
    <Card className="border border-orange-200 bg-gradient-to-br from-orange-50/80 to-amber-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Refund Mode</h3>
        <p className="text-xs text-slate-600">Choose how the refund will be issued.</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange?.(m.value)}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 py-2 text-xs font-medium ${
                value === m.value
                  ? 'border-orange-600 bg-orange-100 text-orange-800'
                  : 'border-slate-200 bg-white hover:border-orange-300 text-slate-700'
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

