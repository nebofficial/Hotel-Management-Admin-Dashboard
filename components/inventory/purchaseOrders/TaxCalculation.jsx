'use client'

import { useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Receipt } from 'lucide-react'

export default function TaxCalculation({ subtotal = 0, taxRate = 0, onTaxRateChange }) {
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate])
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount])

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Receipt className="h-4 w-4 text-purple-600" />
        <Label className="text-sm font-semibold text-slate-900">Tax Calculation</Label>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal:</span>
          <span className="font-semibold text-slate-900">₹{Number(subtotal).toFixed(2)}</span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tax-rate" className="text-xs">Tax Rate (%)</Label>
          <Input
            id="tax-rate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(e) => onTaxRateChange?.(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="text-sm"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Tax Amount:</span>
          <span className="font-semibold text-purple-600">₹{taxAmount.toFixed(2)}</span>
        </div>

        <div className="pt-2 border-t border-purple-200 flex justify-between">
          <span className="text-sm font-semibold text-slate-900">Total Amount:</span>
          <span className="text-lg font-bold text-purple-600">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
