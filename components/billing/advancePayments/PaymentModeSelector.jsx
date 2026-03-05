'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Banknote, CreditCard, Smartphone, Landmark } from 'lucide-react'

const MODES = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'bank', label: 'Bank Transfer', icon: Landmark },
]

export default function PaymentModeSelector({ value, onChange }) {
  return (
    <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-blue-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Payment Mode</h3>
        <p className="text-xs text-slate-600">Choose how the advance is collected.</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange?.(m.value)}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 py-2 text-xs font-medium transition-colors ${
                value === m.value
                  ? 'border-indigo-600 bg-indigo-100 text-indigo-800'
                  : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700'
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

