'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RefundReceipt({ receipt }) {
  if (!receipt) {
    return (
      <Card className="border border-slate-200 bg-white/90">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Refund Receipt</h3>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-500">
          No receipt generated yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">Refund Receipt</h3>
        <p className="text-xs text-slate-600">
          Refund #{receipt.receiptNumber} • {receipt.createdAt && new Date(receipt.createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-1.5 text-sm">
        {receipt.guest && (
          <>
            <div className="flex justify-between">
              <span>Guest</span>
              <span className="font-semibold">{receipt.guest.name}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Room</span>
              <span>{receipt.guest.roomNumber}</span>
            </div>
          </>
        )}
        <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
          <span>Refund Amount</span>
          <span className="font-semibold text-rose-700">
            ₹{Number(receipt.refundAmount || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Mode</span>
          <span>{receipt.method}</span>
        </div>
        {receipt.reason && (
          <div className="text-xs text-slate-600">
            <span className="font-medium">Reason: </span>
            {receipt.reason}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

