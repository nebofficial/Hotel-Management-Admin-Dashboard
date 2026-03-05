'use client'

import { Label } from '@/components/ui/label'
import { DollarSign } from 'lucide-react'

export default function OpeningBalanceSetup({ amount, balanceType, onAmountChange, onBalanceTypeChange, currency }) {
  return (
    <div className="space-y-3 rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4">
      <Label className="text-gray-800 font-medium flex items-center gap-1">
        <DollarSign className="h-4 w-4" /> Opening Balance
      </Label>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[120px]">
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount ?? 0}
            onChange={(e) => onAmountChange(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onBalanceTypeChange('Debit')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${balanceType === 'Debit' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Debit
          </button>
          <button
            type="button"
            onClick={() => onBalanceTypeChange('Credit')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${balanceType === 'Credit' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Credit
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-600">{currency || 'USD'}</p>
    </div>
  )
}
