'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function PDFExport({ invoice }) {
  const handleExport = () => {
    if (!invoice) {
      alert('Select or create an invoice first.')
      return
    }

    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Invoice', w / 2, 16, { align: 'center' })

    doc.setFontSize(10)
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 14, 24)
    doc.text(`Date: ${invoice.issueDate || ''}`, 14, 30)
    doc.text(`Guest: ${invoice.guestName || ''}`, 14, 36)

    let y = 44
    doc.text('Items:', 14, y)
    y += 4
    const items = invoice.items || []
    items.forEach((it) => {
      const line = `${it.description || ''}  x${it.quantity || 0}  @ ${Number(
        it.price || 0
      ).toFixed(2)}`
      doc.text(line, 16, y)
      y += 5
    })

    y += 4
    doc.text(
      `Subtotal: $${Number(invoice.subtotal || 0).toFixed(2)}`,
      14,
      y
    )
    y += 5
    doc.text(
      `Tax: $${Number(invoice.taxAmount || 0).toFixed(2)} (${Number(
        invoice.taxPercent || 0
      ).toFixed(2)}%)`,
      14,
      y
    )
    y += 5
    doc.text(
      `Total: $${Number(invoice.totalAmount || 0).toFixed(2)}`,
      14,
      y
    )

    doc.save(`${invoice.invoiceNumber || 'Invoice'}.pdf`)
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-teal-900 text-base">
          <FileText className="h-4 w-4" />
          Export Invoice PDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          size="sm"
          onClick={handleExport}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
        >
          Download PDF
        </Button>
      </CardContent>
    </Card>
  )
}

