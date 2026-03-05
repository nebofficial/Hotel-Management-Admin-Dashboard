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
import { Label } from '@/components/ui/label'
import PaymentModeSelector from './PaymentModeSelector'
import { useState } from 'react'

export default function RefundAdvanceModal({ open, onClose, onSubmit, maxAmount, loading }) {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('cash')
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const amt = Number(amount || 0)
    if (!amt || Number.isNaN(amt)) return
    if (maxAmount && amt > maxAmount) return
    onSubmit?.({ amount: amt, mode, reason })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Refund Advance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Refund Amount</Label>
              <Input
                type="number"
                value={amount}
                max={maxAmount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
              {maxAmount != null && (
                <p className="text-xs text-slate-500 mt-1">
                  Available balance: ₹{Number(maxAmount || 0).toFixed(2)}
                </p>
              )}
            </div>
            <div>
              <Label>Reason</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for refund"
                className="mt-1"
              />
            </div>
          </div>
          <PaymentModeSelector value={mode} onChange={setMode} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Refund'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

