'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ExtraServices({ value, onChange, quote }) {
  const v = value || {}
  const set = (patch) => onChange((x) => ({ ...(x || {}), ...patch }))

  const [addOnName, setAddOnName] = useState('')
  const [addOnPrice, setAddOnPrice] = useState('')

  const addCustom = () => {
    const name = String(addOnName || '').trim()
    const price = Number(addOnPrice || 0) || 0
    if (!name || price <= 0) return
    set({
      customAddOns: [...(v.customAddOns || []), { name, price }],
    })
    setAddOnName('')
    setAddOnPrice('')
  }

  const removeCustom = (idx) => {
    const arr = [...(v.customAddOns || [])]
    arr.splice(idx, 1)
    set({ customAddOns: arr })
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900">Extra Services</CardTitle>
        <div className="text-slate-800/80 text-sm">Live subtotal updates into pricing.</div>
      </CardHeader>
      <CardContent className="bg-white/30 backdrop-blur-sm rounded-t-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/40 px-3 py-3">
            <Checkbox checked={Boolean(v.breakfast)} onCheckedChange={(c) => set({ breakfast: Boolean(c) })} />
            <div>
              <div className="font-semibold">Breakfast</div>
              <div className="text-xs text-slate-700">Per night • per guest</div>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/40 px-3 py-3">
            <Checkbox checked={Boolean(v.airportPickup)} onCheckedChange={(c) => set({ airportPickup: Boolean(c) })} />
            <div>
              <div className="font-semibold">Airport Pickup</div>
              <div className="text-xs text-slate-700">One-time</div>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/40 px-3 py-3">
            <Checkbox checked={Boolean(v.extraBed)} onCheckedChange={(c) => set({ extraBed: Boolean(c) })} />
            <div>
              <div className="font-semibold">Extra Bed</div>
              <div className="text-xs text-slate-700">Per night</div>
            </div>
          </label>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold">Custom Add-ons</div>
            <div className="text-sm text-slate-700">Extras subtotal: {quote ? quote.extrasCost : '—'}</div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-3">
              <Label className="text-xs text-slate-700">Name</Label>
              <Input value={addOnName} onChange={(e) => setAddOnName(e.target.value)} placeholder="e.g., Champagne" />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs text-slate-700">Price</Label>
              <Input
                type="number"
                min={0}
                value={addOnPrice}
                onChange={(e) => setAddOnPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button type="button" onClick={addCustom} className="w-full">
                Add
              </Button>
            </div>
          </div>

          {Array.isArray(v.customAddOns) && v.customAddOns.length > 0 && (
            <div className="mt-4 space-y-2">
              {v.customAddOns.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex items-center justify-between rounded-xl bg-white/50 px-3 py-2">
                  <div className="text-sm">
                    <span className="font-semibold">{item.name}</span>{' '}
                    <span className="text-slate-700">({Number(item.price || 0).toFixed(2)})</span>
                  </div>
                  <Button type="button" variant="secondary" onClick={() => removeCustom(idx)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

