'use client'

import { Label } from '@/components/ui/label'

export default function TaxCalculation({ subtotal, taxPercent, onChange }) {
  const sub = Number(subtotal || 0)
  const percent = Number(taxPercent || 0)
  const taxAmount = (sub * percent) / 100
  const total = sub + taxAmount

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label className="text-xs text-gray-700">Subtotal</Label>
          <p className="mt-1 text-sm font-semibold">${sub.toFixed(2)}</p>
        </div>
        <div>
          <Label className="text-xs text-gray-700">GST %</Label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={percent}
            onChange={(e) => onChange?.(Number(e.target.value || 0))}
            className="mt-1 w-20 rounded-xl border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Tax Amount</span>
        <span className="font-semibold">${taxAmount.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-800">Total</span>
        <span className="font-bold text-emerald-700">${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

