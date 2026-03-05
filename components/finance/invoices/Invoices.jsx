'use client'

import { useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GenerateInvoice from './GenerateInvoice'
import InvoiceHistory from './InvoiceHistory'
import PDFExport from './PDFExport'
import PaymentStatusBadge from './PaymentStatusBadge'

export default function Invoices() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [lastInvoice, setLastInvoice] = useState(null)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to manage invoices.
        </p>
      </div>
    )
  }

  if (!apiBase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading invoices...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-sky-50/20 to-emerald-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">
            Generate invoices, track payment status, and export PDFs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GenerateInvoice apiBase={apiBase} onCreated={setLastInvoice} />
        <InvoiceHistory apiBase={apiBase} lastCreated={lastInvoice} />
        <div className="space-y-3">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-400 text-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payment Status Widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-xs text-amber-900">
                This widget will summarize total Paid / Pending / Overdue once more invoice/payment
                logic is integrated. For now, status is visible per invoice in history.
              </p>
              {lastInvoice && (
                <div className="text-xs bg-white/70 rounded-xl p-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{lastInvoice.invoiceNumber}</p>
                    <p className="text-amber-900">{lastInvoice.guestName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${Number(lastInvoice.totalAmount || 0).toFixed(2)}
                    </p>
                    <PaymentStatusBadge status={lastInvoice.status} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <PDFExport invoice={lastInvoice} />
        </div>
      </div>
    </div>
  )
}

