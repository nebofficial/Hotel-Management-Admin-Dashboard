'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'

const METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'upi', label: 'UPI' },
  { id: 'bank', label: 'Bank' },
]

export default function PaymentSplit({ netPayable = 0, payments = [], onChange, readonly }) {
  const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0)
  const difference = Number(netPayable || 0) - total

  const addRow = () => {
    if (readonly) return
    onChange?.([
      ...payments,
      {
        id: crypto.randomUUID(),
        method: 'cash',
        amount: Math.max(0, Number(netPayable || 0) - total),
      },
    ])
  }

  const updateRow = (id, patch) => {
    if (readonly) return
    onChange?.(payments.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const removeRow = (id) => {
    if (readonly) return
    onChange?.(payments.filter((p) => p.id !== id))
  }

  const chipClass =
    Math.abs(difference) < 0.5
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : difference > 0
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-red-100 text-red-800 border-red-200'

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-red-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Split Payment</CardTitle>
        <p className="text-xs text-rose-100">
          Support multiple payment modes for settling the bill.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {payments.map((p) => (
          <div key={p.id} className="flex items-center gap-2 text-xs">
            <select
              disabled={readonly}
              value={p.method || 'cash'}
              onChange={(e) => updateRow(p.id, { method: e.target.value })}
              className="rounded-md bg-white/10 border border-white/40 px-2 py-1 text-xs"
            >
              {METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <Input
              type="number"
              min="0"
              step="0.01"
              disabled={readonly}
              value={p.amount ?? 0}
              onChange={(e) => updateRow(p.id, { amount: Number(e.target.value) || 0 })}
              className="h-8 text-xs bg-white/10 border-white/40 text-right"
            />
            {!readonly && (
              <button
                type="button"
                onClick={() => removeRow(p.id)}
                className="text-white/80 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {!readonly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            className="border-white/60 text-white bg-white/10 hover:bg-white/20 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Payment Mode
          </Button>
        )}

        <div className="flex justify-between items-center text-xs pt-1 border-t border-white/30">
          <span>Total Paid</span>
          <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span>Net Payable</span>
          <span>₹{Number(netPayable || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span>Difference</span>
          <Badge className={chipClass}>
            {Math.abs(difference) < 0.5
              ? 'Balanced'
              : difference > 0
              ? `Short by ₹${difference.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
              : `Over by ₹${Math.abs(difference).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

