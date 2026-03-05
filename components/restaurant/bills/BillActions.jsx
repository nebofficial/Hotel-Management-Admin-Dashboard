'use client'

import { Button } from '@/components/ui/button'
import { Printer, XCircle, RotateCcw } from 'lucide-react'

export default function BillActions({
  onPrint,
  onCancel,
  onRefund,
  bill,
  loading,
}) {
  const isPaid = bill?.status === 'Paid'
  const isPending = bill?.status === 'Pending' || bill?.status === 'On Hold'
  const canRefund = isPaid
  const canCancel = isPending

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrint}
        className="gap-1.5"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
      {canCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={loading}
          className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
        >
          <XCircle className="w-4 h-4" />
          Cancel Bill
        </Button>
      )}
      {canRefund && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefund}
          disabled={loading}
          className="gap-1.5 text-amber-700 border-amber-200 hover:bg-amber-50"
        >
          <RotateCcw className="w-4 h-4" />
          Refund
        </Button>
      )}
    </div>
  )
}
