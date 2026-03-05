'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Banknote, CreditCard, Smartphone, Landmark } from 'lucide-react'

const MODES = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'bank', label: 'Bank Transfer', icon: Landmark },
]

export default function PaymentSettlementPanel({ netPayable, onSettle, loading }) {
  const [payments, setPayments] = useState([{ method: 'cash', amount: netPayable }])

  const updatePayment = (index, patch) => {
    setPayments((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  const addSplit = () => {
    setPayments((prev) => [...prev, { method: 'cash', amount: 0 }])
  }

  const removeSplit = (index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index))
  }

  const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0)

  const handleSettle = () => {
    onSettle?.(payments)
  }

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-indigo-50/80 to-cyan-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Payment Settlement</h3>
        <p className="text-xs text-slate-600">Multi-mode payment and partial splits</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {payments.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                value={p.method}
                onChange={(e) => updatePayment(idx, { method: e.target.value })}
                className="h-8 text-xs border border-slate-200 rounded px-1 bg-white"
              >
                {MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={p.amount}
                onChange={(e) => updatePayment(idx, { amount: Number(e.target.value || 0) })}
                className="h-8 text-xs border border-slate-200 rounded px-2 w-28"
              />
              {payments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSplit(idx)}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSplit}
          className="text-[11px] text-slate-600 hover:text-indigo-700"
        >
          + Add split payment
        </button>
        <div className="flex justify-between pt-2 border-t border-slate-200 mt-1 text-sm">
          <span className="text-slate-700">Net Payable</span>
          <span className="font-semibold text-slate-900">₹{Number(netPayable || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Planned Payments</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <Button
          type="button"
          className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
          onClick={handleSettle}
        >
          {loading ? 'Settling...' : 'Settle Combined Bill'}
        </Button>
      </CardContent>
    </Card>
  )
}

