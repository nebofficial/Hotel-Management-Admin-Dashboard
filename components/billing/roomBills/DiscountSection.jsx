'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function DiscountSection({
  subtotal = 0,
  discountAmount = 0,
  discountPercent = 0,
  applyBeforeTax = true,
  onChange,
  readonly,
}) {
  const totalDisc = Math.min(
    Number(subtotal || 0),
    Number(discountAmount || 0) + (Number(subtotal || 0) * Number(discountPercent || 0)) / 100,
  )
  const afterDisc = Number(subtotal || 0) - totalDisc

  const emit = (patch) => {
    onChange?.({
      discountAmount,
      discountPercent,
      applyBeforeTax,
      ...patch,
    })
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 to-yellow-400 text-amber-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Discount & Tax Base</CardTitle>
        <p className="text-amber-900/80 text-xs">
          Apply manual / percentage discount and choose whether it applies before GST.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-amber-950">Discount (₹)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              readOnly={readonly}
              value={discountAmount}
              onChange={(e) => emit({ discountAmount: Number(e.target.value) || 0 })}
              className="bg-white/60 border-amber-200 text-amber-950"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-amber-950">Discount (%)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              readOnly={readonly}
              value={discountPercent}
              onChange={(e) => emit({ discountPercent: Number(e.target.value) || 0 })}
              className="bg-white/60 border-amber-200 text-amber-950"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Switch
              checked={applyBeforeTax}
              onCheckedChange={(v) => !readonly && emit({ applyBeforeTax: Boolean(v) })}
            />
            <span className="text-amber-950 font-medium">Apply discount before tax</span>
          </div>
        </div>

        <div className="border-t border-amber-300 pt-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-amber-900/80">Subtotal</span>
            <span className="font-semibold">
              ₹{Number(subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-900/80">Discount Total</span>
            <span className="font-semibold">
              -₹{Number(totalDisc || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Discounted Subtotal</span>
            <span>
              ₹{Number(afterDisc || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

