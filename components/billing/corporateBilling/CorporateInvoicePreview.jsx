'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CorporateInvoicePreview({ invoice }) {
  if (!invoice) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-700">Corporate Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-500">Generate an invoice to preview details here.</CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">Corporate Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <div className="font-semibold">{invoice.invoiceNumber}</div>
        <div>Period: {invoice.periodStart || '-'} to {invoice.periodEnd || '-'}</div>
        <div>Total Amount: {invoice.totalAmount}</div>
        <div>Status: {invoice.status}</div>
      </CardContent>
    </Card>
  )
}

