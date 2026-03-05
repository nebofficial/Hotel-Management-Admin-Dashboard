'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Bed } from 'lucide-react'

const CHARGE_TYPES = [
  { value: 'ROOM_CHARGE', label: 'Room rent' },
  { value: 'EXTRA_BED', label: 'Extra bed' },
  { value: 'LATE_CHECKOUT', label: 'Late checkout' },
]

export default function RoomChargesPosting({ selectedBooking, apiBase, onPosted }) {
  const [type, setType] = useState('ROOM_CHARGE')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePost = async () => {
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
          type,
          amount: Number(amount),
          description: description || CHARGE_TYPES.find((t) => t.value === type)?.label,
          isDebit: true,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to post')
      setAmount('')
      setDescription('')
      onPosted?.()
    } catch (e) {
      alert(e.message || 'Failed to post charge')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-amber-50/80 border border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-900 text-base flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Room Charges Posting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedBooking ? (
          <>
            <div>
              <Label>Charge type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2">
                {CHARGE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Amount</Label>
              <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" placeholder="e.g. Day 1 room rent" />
            </div>
            <Button onClick={handlePost} disabled={saving} className="w-full bg-amber-600 hover:bg-amber-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Post Charge
            </Button>
          </>
        ) : (
          <p className="text-sm text-gray-500 py-2">Select a guest first</p>
        )}
      </CardContent>
    </Card>
  )
}
