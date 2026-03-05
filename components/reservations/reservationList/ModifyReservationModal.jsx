'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { checkAvailability, pricingQuote, updateReservation } from '@/services/api/reservationApi'

export default function ModifyReservationModal({ apiBase, open, onOpenChange, reservation, onUpdated }) {
  const [form, setForm] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [quote, setQuote] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (reservation && open) {
      setForm({
        checkIn: reservation.checkIn ? reservation.checkIn.slice(0, 10) : '',
        checkOut: reservation.checkOut ? reservation.checkOut.slice(0, 10) : '',
        roomType: reservation.roomType || '',
        roomId: reservation.roomId || '',
        ratePlan: reservation.ratePlan || 'standard',
      })
      setAvailability(null)
      setQuote(null)
    }
  }, [reservation, open])

  if (!reservation) return null
  const f = form || {}

  const set = (patch) => setForm((prev) => ({ ...(prev || {}), ...patch }))

  const handleRecalculate = async () => {
    if (!apiBase || !f.checkIn || !f.checkOut) return
    try {
      const [avail, price] = await Promise.all([
        checkAvailability(apiBase, {
          checkIn: f.checkIn,
          checkOut: f.checkOut,
          roomType: f.roomType || undefined,
        }),
        pricingQuote(apiBase, {
          checkIn: f.checkIn,
          checkOut: f.checkOut,
          guests: reservation.numberOfGuests || 1,
          roomId: f.roomId || undefined,
          roomType: f.roomType || undefined,
          ratePlan: f.ratePlan || 'standard',
          extras: reservation.extras || {},
        }),
      ])
      setAvailability(avail)
      setQuote(price)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async () => {
    if (!apiBase) return
    setSaving(true)
    try {
      const payload = {
        checkIn: f.checkIn,
        checkOut: f.checkOut,
        roomType: f.roomType || undefined,
        roomId: f.roomId || undefined,
        ratePlan: f.ratePlan || undefined,
      }
      const res = await updateReservation(apiBase, reservation.id, payload)
      onUpdated && onUpdated(res.reservation)
      onOpenChange(false)
    } catch (e) {
      alert(e?.message || 'Failed to update reservation')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-amber-700">Modify Reservation</DialogTitle>
        </DialogHeader>
        <div className="rounded-2xl overflow-hidden border bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900">
          <div className="px-5 py-4 border-b border-amber-300/60">
            <div className="text-xs uppercase tracking-wide text-amber-900/80">Reservation</div>
            <div className="text-lg font-semibold">
              {reservation.bookingNumber || 'Reservation'} – {reservation.guestName || ''}
            </div>
          </div>
          <div className="bg-white/40 px-5 py-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <Label className="text-slate-800">Check-in</Label>
                <Input
                  type="date"
                  value={f.checkIn || ''}
                  onChange={(e) => set({ checkIn: e.target.value })}
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <Label className="text-slate-800">Check-out</Label>
                <Input
                  type="date"
                  value={f.checkOut || ''}
                  onChange={(e) => set({ checkOut: e.target.value })}
                  className="mt-1 h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <Label className="text-slate-800">Room Type</Label>
                <Input
                  value={f.roomType || ''}
                  onChange={(e) => set({ roomType: e.target.value })}
                  placeholder="e.g., Deluxe"
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <Label className="text-slate-800">Room ID (optional)</Label>
                <Input
                  value={f.roomId || ''}
                  onChange={(e) => set({ roomId: e.target.value })}
                  placeholder="Leave blank to auto-assign"
                  className="mt-1 h-8"
                />
              </div>
            </div>

            <div className="text-xs">
              <Label className="text-slate-800">Rate Plan</Label>
              <Select
                value={f.ratePlan || 'standard'}
                onValueChange={(ratePlan) => set({ ratePlan })}
              >
                <SelectTrigger className="mt-1 h-8">
                  <SelectValue placeholder="Select rate plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-700">Availability</div>
                <div className="font-semibold">
                  {availability
                    ? `${availability.availableCount || 0} room(s) available`
                    : 'Run availability check'}
                </div>
              </div>
              <div>
                <div className="text-slate-700">New Total</div>
                <div className="font-semibold">
                  {quote ? Number(quote.total || 0).toFixed(2) : reservation.totalAmount || '—'}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-50"
                onClick={handleRecalculate}
              >
                Recalculate
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-600"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

