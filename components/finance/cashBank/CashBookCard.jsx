'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader2, DollarSign } from 'lucide-react'

export default function CashBookCard({ cashAccount, onQuickAdd }) {
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!cashAccount?.id || !amount || Number(amount) <= 0 || !onQuickAdd) return
    setSaving(true)
    try {
      await onQuickAdd(Number(amount))
    } finally {
      setSaving(false)
    }
  }

  const balance = Number(cashAccount?.currentBalance || cashAccount?.openingBalance || 0)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-green-500 to-emerald-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cash Book
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-emerald-100">Today's Cash Balance</p>
          <p className="text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Quick amount"
            className="flex-1 rounded-xl border border-emerald-200 bg-white/10 px-3 py-2 text-sm placeholder:text-emerald-100 focus:outline-none"
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={saving}
            className="bg-white/90 text-emerald-700 hover:bg-white"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '+ Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
