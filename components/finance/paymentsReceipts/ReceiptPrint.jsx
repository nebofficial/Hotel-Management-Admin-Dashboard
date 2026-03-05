'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function ReceiptPrint({ lastReceipt }) {
  const handlePrint = () => {
    if (!lastReceipt) {
      alert('Record a payment or receipt first.')
      return
    }

    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    const isReceipt = lastReceipt.type === 'receipt'
    const title = isReceipt ? 'Payment Receipt' : 'Payment Voucher'

    doc.setFontSize(16)
    doc.text(title, w / 2, 18, { align: 'center' })

    doc.setFontSize(10)
    const now = new Date()
    doc.text(`Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 26)

    const lines = []
    if (isReceipt) {
      lines.push(`Guest / Customer: ${lastReceipt.guestName || '-'}`)
      lines.push(`Booking / Invoice: ${lastReceipt.bookingId || '-'}`)
    } else {
      lines.push(`Vendor: ${lastReceipt.vendor || '-'}`)
    }
    lines.push(`Amount: $${Number(lastReceipt.amount || 0).toFixed(2)}`)
    lines.push(`Mode: ${lastReceipt.mode || '-'}`)
    if (lastReceipt.reference) {
      lines.push(`Transaction ID: ${lastReceipt.reference}`)
    }

    let y = 34
    lines.forEach((t) => {
      doc.text(t, 14, y)
      y += 6
    })

    y += 10
    doc.text('Signature:', 14, y)

    const fileNameBase =
      (isReceipt ? 'Receipt_' + (lastReceipt.bookingId || lastReceipt.guestName || 'guest') :
        'Payment_' + (lastReceipt.vendor || 'vendor'))
    doc.save(`${fileNameBase}.pdf`)
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 text-slate-50">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Receipt Print
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-slate-200">
          Generate a print-friendly receipt with logo, payment details, reference number and timestamp.
        </p>
        {lastReceipt && (
          <div className="text-xs bg-white/5 rounded-xl p-2 space-y-0.5">
            <p>
              <span className="text-slate-300 mr-1">Last receipt:</span>
              <span className="font-semibold">{lastReceipt.guestName}</span>
            </p>
            <p className="text-slate-300">
              Amount:{' '}
              <span className="font-semibold">
                ${lastReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>{' '}
              · Mode: {lastReceipt.mode}
            </p>
          </div>
        )}
        <Button
          size="sm"
          onClick={handlePrint}
          className="w-full bg-amber-500 hover:bg-amber-600 text-xs"
        >
          Print / Export Receipt
        </Button>
      </CardContent>
    </Card>
  )
}

