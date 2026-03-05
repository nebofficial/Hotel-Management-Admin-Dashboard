'use client'

import { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import jsPDF from 'jspdf'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}

export default function ReservationVoucher({ open, onOpenChange, reservation }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
  }, [open])

  if (!reservation) return null

  const handlePrint = () => {
    if (!ref.current) return
    const printContents = ref.current.innerHTML
    const win = window.open('', '_blank', 'width=800,height=600')
    if (!win) return
    win.document.write(`<html><head><title>Reservation Voucher</title></head><body>${printContents}</body></html>`)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Reservation Voucher', 20, 20)
    doc.setFontSize(11)
    const lines = [
      `Reservation #: ${reservation.bookingNumber || ''}`,
      `Guest: ${reservation.guestName || ''}`,
      `Phone: ${reservation.guestPhone || ''}`,
      `Room: ${reservation.roomNumber || ''} ${reservation.roomType ? `(${reservation.roomType})` : ''}`,
      `Check-in: ${formatDate(reservation.checkIn)}`,
      `Check-out: ${formatDate(reservation.checkOut)}`,
      `Total Amount: ${reservation.totalAmount || ''}`,
      `Advance Paid: ${reservation.advancePaid || ''}`,
      `Balance Due: ${reservation.balanceAmount || ''}`,
    ]
    let y = 32
    lines.forEach((line) => {
      doc.text(line, 20, y)
      y += 7
    })
    doc.save(`voucher-${reservation.bookingNumber || reservation.id}.pdf`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-red-700">Reservation Voucher</DialogTitle>
        </DialogHeader>
        <div
          ref={ref}
          className="rounded-2xl overflow-hidden border bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 text-white"
        >
          <div className="px-5 py-4 border-b border-red-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-red-100">Hotel Manager</div>
              <div className="text-lg font-semibold">Reservation Voucher</div>
            </div>
            <div className="text-right text-xs">
              <div className="font-semibold">Reservation #</div>
              <div>{reservation.bookingNumber || '—'}</div>
            </div>
          </div>
          <div className="bg-white/5 px-5 py-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-red-100/80 text-xs">Guest Name</div>
                <div className="font-semibold">{reservation.guestName || '—'}</div>
              </div>
              <div>
                <div className="text-red-100/80 text-xs">Phone</div>
                <div className="font-semibold">{reservation.guestPhone || '—'}</div>
              </div>
              <div>
                <div className="text-red-100/80 text-xs">Room</div>
                <div className="font-semibold">
                  {reservation.roomNumber || '—'} {reservation.roomType ? `• ${reservation.roomType}` : ''}
                </div>
              </div>
              <div>
                <div className="text-red-100/80 text-xs">Status</div>
                <div className="font-semibold capitalize">{reservation.status || '—'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-red-100/80 text-xs">Check-in</div>
                <div className="font-semibold">{formatDate(reservation.checkIn)}</div>
              </div>
              <div>
                <div className="text-red-100/80 text-xs">Check-out</div>
                <div className="font-semibold">{formatDate(reservation.checkOut)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-red-100/80">Total Amount</div>
                <div className="font-semibold">
                  {typeof reservation.totalAmount !== 'undefined'
                    ? Number(reservation.totalAmount).toFixed(2)
                    : '—'}
                </div>
              </div>
              <div>
                <div className="text-red-100/80">Advance Paid</div>
                <div className="font-semibold">
                  {typeof reservation.advancePaid !== 'undefined'
                    ? Number(reservation.advancePaid).toFixed(2)
                    : '—'}
                </div>
              </div>
              <div>
                <div className="text-red-100/80">Balance Due</div>
                <div className="font-semibold">
                  {typeof reservation.balanceAmount !== 'undefined'
                    ? Number(reservation.balanceAmount).toFixed(2)
                    : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handlePrint} className="border-red-500 text-red-700 hover:bg-red-50">
            Print
          </Button>
          <Button onClick={handleDownloadPdf} className="bg-red-600 hover:bg-red-700">
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

