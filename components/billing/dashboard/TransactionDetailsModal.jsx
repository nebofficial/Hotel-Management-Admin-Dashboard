'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function TransactionDetailsModal({ open, onClose, transaction }) {
  if (!transaction) return null

  const fmt = (n) =>
    '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const statusColor = {
    PAID: 'text-emerald-600 bg-emerald-50',
    Paid: 'text-emerald-600 bg-emerald-50',
    PENDING: 'text-amber-600 bg-amber-50',
    Pending: 'text-amber-600 bg-amber-50',
    OVERDUE: 'text-red-600 bg-red-50',
    Refunded: 'text-gray-600 bg-gray-100',
    Cancelled: 'text-gray-600 bg-gray-100',
  }[transaction.paymentStatus] || 'text-gray-600 bg-gray-100'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Invoice / Bill #</span>
            <span className="font-medium">{transaction.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Guest Name</span>
            <span className="font-medium">{transaction.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bill Type</span>
            <span className="font-medium">{transaction.billType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-bold">{fmt(transaction.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {transaction.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">
              {new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
