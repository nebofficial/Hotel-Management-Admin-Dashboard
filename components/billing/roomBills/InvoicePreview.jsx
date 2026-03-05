'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Printer } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function InvoicePreview({ bill, hotel, onEmail, onWhatsApp }) {
  if (!bill) {
    return (
      <Card className="border-0 shadow-md rounded-2xl bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-900">Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-500">
          Select a booking and enter charges to preview invoice.
        </CardContent>
      </Card>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePdf = () => {
    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    doc.setFontSize(14)
    doc.text(hotel?.name || 'Hotel', 14, 14)

    doc.setFontSize(10)
    doc.text(`Room Bill: ${bill.billNumber || ''}`, w - 14, 14, { align: 'right' })
    doc.text(`Guest: ${bill.guestName || ''}`, 14, 22)
    doc.text(`Room: ${bill.roomNumber || ''}`, 14, 28)
    doc.text(
      `Stay: ${bill.checkIn?.slice(0, 10) || ''} → ${bill.checkOut?.slice(0, 10) || ''} (${bill.nights} nights)`,
      14,
      34,
    )

    const rows = []
    rows.push([
      'Room Tariff & Charges',
      '',
      '',
      Number(bill.roomSubtotal || 0).toFixed(2),
    ])
    ;(bill.extras || []).forEach((x) => {
      rows.push([
        x.name || 'Extra Service',
        x.qty || 1,
        Number(x.rate || 0).toFixed(2),
        Number(x.amount || 0).toFixed(2),
      ])
    })

    autoTable(doc, {
      startY: 42,
      head: [['Description', 'Qty', 'Rate', 'Amount']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    })

    let y = (doc.lastAutoTable?.finalY || 60) + 6
    const addLine = (label, value) => {
      doc.text(label, 120, y)
      doc.text(value, w - 14, y, { align: 'right' })
      y += 5
    }

    addLine('Subtotal', Number(bill.subtotal || 0).toFixed(2))
    addLine('Discount', `-${Number(bill.discountTotal || 0).toFixed(2)}`)
    addLine('Taxable Amount', Number(bill.taxableAmount || 0).toFixed(2))
    addLine(
      'CGST + SGST / IGST',
      Number(bill.taxTotal || 0).toFixed(2),
    )
    if (bill.serviceChargeAmount) {
      addLine('Service Charge', Number(bill.serviceChargeAmount || 0).toFixed(2))
    }
    addLine('Grand Total', Number(bill.grandTotal || 0).toFixed(2))
    addLine('Advance Adjusted', `-${Number(bill.advanceAdjusted || 0).toFixed(2)}`)
    addLine('Net Payable', Number(bill.netPayable || 0).toFixed(2))

    doc.save(`${bill.billNumber || 'Room_Bill'}.pdf`)
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-900">Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs text-gray-800">
        <div className="space-y-0.5">
          <div className="font-semibold">{hotel?.name || 'Hotel'}</div>
          <div className="text-gray-500 text-[11px]">
            Room Bill: {bill.billNumber || 'Draft'} • Room {bill.roomNumber}
          </div>
          <div className="text-gray-500 text-[11px]">
            Guest: {bill.guestName} • Stay {bill.checkIn?.slice(0, 10)} →{' '}
            {bill.checkOut?.slice(0, 10)} ({bill.nights} nights)
          </div>
        </div>

        <div className="space-y-1 border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <span>Room + Extras</span>
            <span>
              ₹{Number(bill.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>
              -₹{Number(bill.discountTotal || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Taxable Amount</span>
            <span>
              ₹{Number(bill.taxableAmount || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>GST (CGST+SGST/IGST)</span>
            <span>
              ₹{Number(bill.taxTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {bill.serviceChargeAmount ? (
            <div className="flex justify-between">
              <span>Service Charge</span>
              <span>
                ₹{Number(bill.serviceChargeAmount || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between font-semibold border-t border-dashed border-gray-300 pt-1">
            <span>Grand Total</span>
            <span>
              ₹{Number(bill.grandTotal || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Advance Adjusted</span>
            <span>
              -₹{Number(bill.advanceAdjusted || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Net Payable</span>
            <span>
              ₹{Number(bill.netPayable || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-gray-800 border-gray-300"
            onClick={handlePrint}
          >
            <Printer className="h-3.5 w-3.5 mr-1" /> Print
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handlePdf}
          >
            <FileText className="h-3.5 w-3.5 mr-1" /> PDF
          </Button>
          {onEmail && (
            <Button type="button" size="sm" variant="outline" onClick={onEmail}>
              Email
            </Button>
          )}
          {onWhatsApp && (
            <Button type="button" size="sm" variant="outline" onClick={onWhatsApp}>
              WhatsApp
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

