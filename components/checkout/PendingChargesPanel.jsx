'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

const PRESET_CHARGES = ['Mini Bar', 'Laundry', 'Restaurant', 'Damage', 'Other']

export default function PendingChargesPanel({ charges, onAdd, onLocalChange }) {
  const list = charges || []
  const [form, setForm] = useState({ name: 'Mini Bar', qty: 1, rate: 0 })

  const handleAdd = () => {
    if (!form.name) return
    const qty = Number(form.qty || 1)
    const rate = Number(form.rate || 0)
    if (qty <= 0 || rate <= 0) return
    const item = {
      name: form.name,
      qty,
      rate,
      amount: qty * rate,
    }
    onAdd?.(item)
    setForm({ ...form, rate: 0 })
  }

  const handleRemoveLocal = (idx) => {
    const next = list.filter((_, i) => i !== idx)
    onLocalChange?.(next)
  }

  const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Pending Charges</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <Label className="text-white/90">Charge Type</Label>
            <select
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full h-9 rounded-md bg-white/15 text-white border border-white/20 text-xs"
            >
              {PRESET_CHARGES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-white/90">Qty</Label>
            <Input
              type="number"
              min={1}
              value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value || 1) }))}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-white/90">Rate</Label>
              <Input
                type="number"
                min={0}
                value={form.rate}
                onChange={(e) => setForm((f) => ({ ...f, rate: Number(e.target.value || 0) }))}
                className="mt-1 bg-white/15 text-white border-white/20 h-9"
              />
            </div>
            <Button
              type="button"
              onClick={handleAdd}
              className="mt-6 h-9 bg-white text-purple-700 hover:bg-purple-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto mt-2 space-y-1">
          {list.length === 0 && (
            <p className="text-[11px] text-purple-100 text-center py-2">
              No extra charges added. Add mini bar, laundry, or other services here.
            </p>
          )}
          {list.map((c, idx) => (
            <div
              key={`${c.name}-${idx}`}
              className="flex items-center justify-between bg-white/10 border border-white/20 rounded-md px-2 py-1"
            >
              <div>
                <div className="font-semibold text-xs">{c.name}</div>
                <div className="text-[11px] text-purple-100">
                  {c.qty} × ₹{Number(c.rate || 0).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs">{formatCurrency(c.amount)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLocal(idx)}
                  className="text-purple-100 hover:text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

