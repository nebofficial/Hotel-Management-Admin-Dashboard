'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function OtherChargesPanel({ charges = [], onChange, loading }) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')

  const addCharge = () => {
    const amt = Number(amount)
    if (!label || !amt || Number.isNaN(amt)) return
    // Use a simple, browser-safe unique id (no crypto dependency)
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    const next = [...charges, { id, description: label, amount: amt }]
    onChange?.(next)
    setLabel('')
    setAmount('')
  }

  const total = charges.reduce((s, c) => s + Number(c.amount || 0), 0)

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-violet-50/80 to-purple-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Other Charges</h3>
        <p className="text-xs text-slate-600">Spa, laundry, and miscellaneous charges</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Description"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-8 text-xs"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-8 w-28 text-xs"
          />
          <Button type="button" size="sm" onClick={addCharge} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
            Add
          </Button>
        </div>
        <div className="max-h-24 overflow-y-auto border border-slate-200/70 rounded-md bg-white/70 mt-1">
          {charges.length === 0 && <p className="text-xs text-slate-500 px-3 py-2">No other charges added.</p>}
          {charges.map((c) => (
            <div key={c.id} className="flex justify-between px-3 py-1.5 border-b border-slate-100 last:border-b-0">
              <span className="text-xs text-slate-700">{c.description}</span>
              <span className="text-xs font-semibold text-slate-900">₹{Number(c.amount || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-1 border-t border-slate-200 mt-1 text-sm">
          <span className="text-slate-700">Total Other Charges</span>
          <span className="font-semibold text-slate-900">₹{total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

