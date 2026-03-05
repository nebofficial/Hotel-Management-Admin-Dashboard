'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreditNotePreview({ creditNote, invoice }) {
  if (!creditNote) {
    return (
      <Card className="border border-slate-200 bg-white/90">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Credit Note Preview</h3>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-500">
          Generate a credit note to preview it here.
        </CardContent>
      </Card>
    )
  }

  const remaining =
    Number(creditNote.totalAmount || 0) - Number(creditNote.usedAmount || 0)

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">Credit Note</h3>
        <p className="text-xs text-slate-600">
          CN #{creditNote.creditNoteNumber} • {creditNote.createdAt && new Date(creditNote.createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-1.5 text-sm">
        {invoice && (
          <div className="flex justify-between text-xs text-slate-600">
            <span>Invoice</span>
            <span>{invoice.invoiceNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Guest</span>
          <span className="font-semibold">{creditNote.guestName}</span>
        </div>
        <div className="flex justify-between">
          <span>Credit Amount</span>
          <span>₹{Number(creditNote.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Used</span>
          <span>₹{Number(creditNote.usedAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Remaining</span>
          <span>₹{remaining.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

