'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Percent, IndianRupee } from 'lucide-react'

export default function DiscountPanel({
  discountType = 'percent',
  discountValue = 0,
  onTypeChange,
  onValueChange,
  subtotal = 0,
  requiresApproval,
  onApply,
  hasBill,
  loading,
}) {
  const discountAmount =
    discountType === 'percent' ? (subtotal * discountValue) / 100 : discountValue

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-amber-50/80 to-yellow-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800">Discount</h3>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onTypeChange?.('percent')}
            className={`flex-1 flex items-center justify-center gap-1 p-2 rounded border text-xs ${
              discountType === 'percent' ? 'border-amber-600 bg-amber-100' : 'border-slate-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            %
          </button>
          <button
            type="button"
            onClick={() => onTypeChange?.('amount')}
            className={`flex-1 flex items-center justify-center gap-1 p-2 rounded border text-xs ${
              discountType === 'amount' ? 'border-amber-600 bg-amber-100' : 'border-slate-200'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            Flat
          </button>
        </div>
        <Input
          type="number"
          min={0}
          max={discountType === 'percent' ? 100 : subtotal}
          step={discountType === 'percent' ? 1 : 1}
          placeholder={discountType === 'percent' ? 'e.g. 10' : 'e.g. 50'}
          value={discountValue || ''}
          onChange={(e) => onValueChange?.(Number(e.target.value) || 0)}
          className="h-9"
        />
        {discountAmount > 0 && (
          <>
            <p className="text-xs text-slate-600">
              Discount: ₹{discountAmount.toFixed(2)}
              {requiresApproval && (
                <span className="ml-1 text-amber-600 font-medium">(Manager approval required)</span>
              )}
            </p>
            {hasBill && onApply && (
              <button
                type="button"
                onClick={onApply}
                disabled={loading}
                className="w-full mt-2 py-1.5 rounded bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? 'Applying...' : 'Apply Discount'}
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
