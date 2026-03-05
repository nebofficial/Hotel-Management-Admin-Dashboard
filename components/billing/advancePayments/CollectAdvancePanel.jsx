'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PaymentModeSelector from './PaymentModeSelector'

export default function CollectAdvancePanel({ booking, onCollect, loading, lastReceipt }) {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('cash')
  const [notes, setNotes] = useState('')

  const autoReceipt = useMemo(() => {
    if (lastReceipt) return lastReceipt
    const year = new Date().getFullYear()
    return `ADV-${year}-0001`
  }, [lastReceipt])

  const handleCollect = () => {
    const amt = Number(amount || 0)
    if (!booking) return
    if (!amt || Number.isNaN(amt)) return
    onCollect?.({
      bookingId: booking.id,
      amount: amt,
      mode,
      notes,
    })
    setAmount('')
    setNotes('')
  }

  return (
    <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-teal-50/80">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-emerald-900">Collect Advance</h3>
          <p className="text-xs text-emerald-800/80">
            Receipt number auto-generated when advance is saved.
          </p>
        </div>
        <span className="text-[11px] font-mono font-semibold text-emerald-900 bg-white/80 px-2 py-0.5 rounded">
          {autoReceipt}
        </span>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[11px] text-emerald-900 font-semibold">Linked Booking</p>
            {booking ? (
              <div className="rounded-md bg-white/80 border border-emerald-100 px-3 py-2 text-[11px] text-emerald-900">
                <div className="font-semibold">
                  {booking.guestName} – Room {booking.roomNumber}
                </div>
                <div>
                  {new Date(booking.checkIn).toLocaleDateString()} →{' '}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </div>
                <div>Total: ₹{Number(booking.totalAmount || 0).toFixed(2)}</div>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-700">Select a booking on the left.</p>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[11px] text-slate-700 mb-1">Advance Amount</p>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <p className="text-[11px] text-slate-700 mb-1">Notes</p>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <PaymentModeSelector value={mode} onChange={setMode} />

        <Button
          type="button"
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
          disabled={loading || !booking}
          onClick={handleCollect}
        >
          {loading ? 'Collecting...' : 'Generate Advance Receipt'}
        </Button>
      </CardContent>
    </Card>
  )
}

