'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Gauge } from 'lucide-react'

export default function CreditLimitControl({ guest, currentBalance, apiBase, onUpdated }) {
  const [limit, setLimit] = useState(guest?.creditLimit ?? '')
  const used = Math.max(0, Number(currentBalance || 0))
  const lim = Number(limit || guest?.creditLimit || 0) || 0
  const pct = lim > 0 ? Math.min(100, Math.round((used / lim) * 100)) : 0
  const over = lim > 0 && used > lim

  const handleSave = async () => {
    if (!guest?.id || !apiBase) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/guest-ledger/guest/${guest.id}/credit-limit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ creditLimit: limit === '' ? null : Number(limit) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to update limit')
      onUpdated?.(data.guest)
    } catch (e) {
      alert(e.message || 'Failed to update limit')
    }
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-900 text-base flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Credit Limit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {guest ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className="font-semibold text-gray-900">${used.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Limit</span>
              <span className="font-semibold text-gray-900">{lim > 0 ? `$${lim.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Not set'}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden border border-amber-200">
              <div
                className={`h-full ${over ? 'bg-red-500' : 'bg-amber-500'} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {over && <p className="text-xs text-red-700">Warning: credit limit exceeded</p>}
            <div>
              <Label>Set credit limit</Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2"
              />
            </div>
            <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700 text-sm">Save Limit</Button>
          </>
        ) : (
          <p className="text-sm text-gray-500 py-2">Select a guest to manage credit limit</p>
        )}
      </CardContent>
    </Card>
  )
}
