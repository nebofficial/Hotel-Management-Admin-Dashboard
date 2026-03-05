'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreditNotePrint({ payload }) {
  if (!payload) {
    return (
      <Card className="border border-slate-200 bg-white/90">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Printable Credit Note</h3>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-500">
          Generate PDF payload to preview print layout.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">Printable Credit Note</h3>
        <p className="text-xs text-slate-600">
          CN #{payload.creditNoteNumber} • {payload.issueDate && new Date(payload.issueDate).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="p-4 text-sm space-y-1.5">
        <div className="flex justify-between">
          <span>Guest</span>
          <span className="font-semibold">{payload.guestName}</span>
        </div>
        <div className="flex justify-between">
          <span>Invoice</span>
          <span>{payload.invoiceNumber}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
          <span>Credit Amount</span>
          <span>₹{Number(payload.amount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Used</span>
          <span>₹{Number(payload.usedAmount || 0).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

