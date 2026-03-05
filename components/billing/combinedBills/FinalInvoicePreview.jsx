'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function FinalInvoicePreview({ invoice }) {
  if (!invoice) {
    return (
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Final Invoice Preview</h3>
          <p className="text-xs text-slate-600">Generate combined invoice to preview layout</p>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-500">
          No invoice generated yet.
        </CardContent>
      </Card>
    )
  }

  const { guest, charges, tax, totals } = invoice

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">Final Invoice Preview</h3>
        <p className="text-xs text-slate-600">
          Guest: {guest?.name} • Room {guest?.roomNumber} •{' '}
          {guest?.checkIn && new Date(guest.checkIn).toLocaleDateString()} →{' '}
          {guest?.checkOut && new Date(guest.checkOut).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Room Charges</span>
          <span>₹{Number(charges?.room || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Restaurant Charges</span>
          <span>₹{Number(charges?.restaurant || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Other Charges</span>
          <span>₹{Number(charges?.other || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
          <span>Subtotal</span>
          <span>₹{Number(charges?.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Tax (CGST+SGST+IGST)</span>
          <span>₹{Number(tax?.totalTax || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Service Charge</span>
          <span>₹{Number(tax?.serviceCharge || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-slate-200 pt-1 mt-1">
          <span>Grand Total</span>
          <span>₹{Number(totals?.grandTotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Paid</span>
          <span>₹{Number(totals?.paidTotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span>Balance</span>
          <span>₹{Number(totals?.balance || 0).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

