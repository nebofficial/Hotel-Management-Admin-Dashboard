'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Repeat } from 'lucide-react'

const MODES = [
  { value: 'ADVANCE', label: 'Advance credit' },
  { value: 'ADJUSTMENT', label: 'Partial payment / adjustment' },
  { value: 'REFUND', label: 'Refund' },
]

export default function PaymentAdjustment({ selectedBooking, apiBase, onAdjusted }) {
  const [mode, setMode] = useState('ADVANCE')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!selectedBooking?.id || !apiBase || !amount || Number(amount) <= 0) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/guest-ledger/entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          guestId: selectedBooking.guestId,
          bookingId: selectedBooking.id,
          type: mode,
          amount: Number(amount),
          description: description || MODES.find((m) => m.value === mode)?.label,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to adjust')
      setAmount('')
      setDescription('')
      onAdjusted?.()
    } catch (e) {
      alert(e.message || 'Failed to adjust')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-indigo-900 text-base flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Payment Adjustment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedBooking ? (
          <>
            <div>
              <Label>Adjustment type</Label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2">
                {MODES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Amount</Label>
              <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Apply Adjustment
            </Button>
          </>
        ) : (
          <p className="text-sm text-gray-500 py-2">Select a guest first</p>
        )}
      </CardContent>
    </Card>
  )
}
