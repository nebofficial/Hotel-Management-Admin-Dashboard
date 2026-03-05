'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function CheckoutConfirmationModal({ open, onClose, invoice }) {
  if (!open) return null

  const totals = invoice?.totals || {}

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            Checkout Completed
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm text-slate-700">
          <p>The combined bill has been settled successfully.</p>
          <div className="flex justify-between pt-2 border-t border-slate-200 mt-1">
            <span>Grand Total</span>
            <span className="font-semibold">
              ₹{Number(totals.grandTotal || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Paid</span>
            <span>₹{Number(totals.paidTotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Balance</span>
            <span>₹{Number(totals.balance || 0).toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

