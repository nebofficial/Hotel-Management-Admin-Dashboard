'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'

const MODES = [
  { value: 'Cash', label: 'Cash', icon: Banknote },
  { value: 'Card', label: 'Card', icon: CreditCard },
  { value: 'UPI', label: 'UPI', icon: Smartphone },
]

export default function PaymentPanel({
  paymentMode = 'Cash',
  onModeChange,
  totalAmount = 0,
  paidAmount = 0,
  onSettle,
  loading,
  disabled,
}) {
  const balance = totalAmount - paidAmount

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-cyan-50/80 to-sky-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800">Payment</h3>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-3">
        <div className="flex gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onModeChange?.(m.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs ${
                paymentMode === m.value ? 'border-cyan-600 bg-cyan-100 text-cyan-800' : 'border-slate-200 bg-white'
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Total</span>
            <span className="font-semibold">₹{Number(totalAmount).toFixed(2)}</span>
          </div>
          {paidAmount > 0 && (
            <div className="flex justify-between mt-1">
              <span className="text-slate-600">Paid</span>
              <span>₹{Number(paidAmount).toFixed(2)}</span>
            </div>
          )}
          {balance > 0 && (
            <div className="flex justify-between mt-1 text-amber-700 font-medium">
              <span>Balance Due</span>
              <span>₹{balance.toFixed(2)}</span>
            </div>
          )}
        </div>
        <Button
          className="w-full bg-cyan-600 hover:bg-cyan-700"
          onClick={onSettle}
          disabled={disabled || loading}
        >
          {loading ? 'Settling...' : 'Settle Bill'}
        </Button>
      </CardContent>
    </Card>
  )
}
