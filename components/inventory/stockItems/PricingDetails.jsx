'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DollarSign, TrendingUp } from 'lucide-react'

export default function PricingDetails({ costPrice, sellingPrice, onCostChange, onSellingChange }) {
  const profit = Number(sellingPrice || 0) - Number(costPrice || 0)
  const profitPercent = Number(costPrice || 0) > 0 ? ((profit / Number(costPrice || 0)) * 100).toFixed(1) : 0

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="h-4 w-4 text-green-600" />
        <Label className="text-sm font-semibold text-slate-900">Pricing Details</Label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="cost-price" className="text-xs">Cost Price (₹)</Label>
          <Input
            id="cost-price"
            type="number"
            min="0"
            step="0.01"
            value={costPrice || ''}
            onChange={(e) => onCostChange?.(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="selling-price" className="text-xs">Selling Price (₹)</Label>
          <Input
            id="selling-price"
            type="number"
            min="0"
            step="0.01"
            value={sellingPrice || ''}
            onChange={(e) => onSellingChange?.(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="text-sm"
          />
        </div>
      </div>

      {costPrice > 0 && sellingPrice > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 border border-green-200">
          <TrendingUp className={`h-4 w-4 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          <div className="flex-1">
            <p className="text-xs text-slate-600">Profit</p>
            <p className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{profit.toFixed(2)} ({profitPercent}%)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
