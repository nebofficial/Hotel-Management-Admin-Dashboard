'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SplitBillModal({ open, onClose, totalAmount, onSplit }) {
  const handleSplit = (e) => {
    e.preventDefault()
    const form = e.target
    const count = Number(form.seats?.value) || 2
    const perSeat = totalAmount / count
    onSplit?.({ perSeat, count })
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Split by Seats</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSplit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Number of seats</label>
            <Input
              name="seats"
              type="number"
              min={2}
              max={20}
              defaultValue={2}
              className="mt-1"
            />
          </div>
          <p className="text-sm text-slate-500">
            Total: ₹{Number(totalAmount || 0).toFixed(2)} — Per seat: ₹
            {(totalAmount / 2).toFixed(2)}
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Split</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
