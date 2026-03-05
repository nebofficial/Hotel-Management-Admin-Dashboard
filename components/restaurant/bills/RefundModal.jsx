'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function RefundModal({
  open,
  onClose,
  bill,
  onRefund,
  loading,
}) {
  const totalAmount = Number(bill?.totalAmount || 0)
  const [amount, setAmount] = useState(totalAmount)
  const [reason, setReason] = useState('Customer request')
  const [mode, setMode] = useState('Cash')

  useEffect(() => {
    if (open) {
      setAmount(totalAmount)
      setReason('Customer request')
      setMode('Cash')
    }
  }, [open, totalAmount])

  const handleSubmit = (e) => {
    e.preventDefault()
    onRefund?.({ refundAmount: amount, reason, refundMode: mode })
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Refund Amount (₹)</Label>
            <Input
              type="number"
              min={0}
              max={totalAmount}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Reason</Label>
            <Input
              placeholder="e.g. Customer request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Refund Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Process Refund'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
