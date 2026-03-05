'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cancelReservation } from '@/services/api/reservationApi'

export default function CancelReservationModal({ apiBase, open, onOpenChange, reservation, onCancelled }) {
  const [reason, setReason] = useState('')
  const [noShow, setNoShow] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (reservation && open) {
      setReason('')
      setNoShow(false)
    }
  }, [reservation, open])

  if (!reservation) return null

  const handleCancel = async () => {
    if (!apiBase) return
    setSaving(true)
    try {
      const res = await cancelReservation(apiBase, reservation.id, {
        reason,
        markNoShow: noShow,
      })
      onCancelled && onCancelled(res.reservation)
      onOpenChange(false)
    } catch (e) {
      alert(e?.message || 'Failed to cancel reservation')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-orange-700">Cancel Reservation</DialogTitle>
        </DialogHeader>
        <div className="rounded-2xl overflow-hidden border bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-900">
          <div className="px-5 py-4 border-b border-orange-300/60">
            <div className="text-xs uppercase tracking-wide text-orange-900/80">Reservation</div>
            <div className="text-lg font-semibold">
              {reservation.bookingNumber || 'Reservation'} – {reservation.guestName || ''}
            </div>
          </div>
          <div className="bg-white/40 px-5 py-4 space-y-4 text-sm">
            <div>
              <Label className="text-slate-800 text-xs">Cancel Reason</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional reason for cancellation"
                className="mt-1 min-h-[80px]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-800">
              <Checkbox checked={noShow} onCheckedChange={(v) => setNoShow(Boolean(v))} />
              Mark as No-show (guest did not arrive)
            </label>

            <div className="text-xs text-slate-700">
              On cancel, status will be set to <span className="font-semibold">Cancelled</span>{' '}
              (or <span className="font-semibold">No-show</span>) and room inventory will be automatically released.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-orange-500 text-orange-700 hover:bg-orange-50"
                onClick={() => onOpenChange(false)}
              >
                Keep Reservation
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {saving ? 'Cancelling…' : 'Confirm Cancel'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

