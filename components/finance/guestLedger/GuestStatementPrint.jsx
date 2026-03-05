'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Printer, FileText, FileSpreadsheet } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function GuestStatementPrint({ booking, transactions, bookings = [], onSelectBooking }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')

  const filtered = (transactions || []).filter((t) => {
    const d = t.createdAt ? new Date(t.createdAt) : null
    if (!d) return true
    if (startDate && d < new Date(startDate)) return false
    if (endDate && d > new Date(endDate)) return false
    return true
  })

  const handlePDF = () => {
    if (!booking) {
      setError('Select a guest first.')
      return
    }
    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()
    doc.setFontSize(16)
    doc.text('Guest Statement', w / 2, 16, null, null, 'center')
    doc.setFontSize(10)
    doc.text(`${booking.guestName} · Room ${booking.roomNumber}`, w / 2, 22, null, null, 'center')
    doc.text(
      `Stay: ${booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''} - ${
        booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''
      }`,
      w / 2,
      28,
      null,
      null,
      'center'
    )
    let y = 36
    const body = filtered.map((t) => [
      t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-',
      t.description || t.type || '-',
      t.isDebit ? Number(t.amount || 0).toFixed(2) : '-',
      !t.isDebit ? Number(t.amount || 0).toFixed(2) : '-',
      Number(t.balance ?? 0).toFixed(2),
    ])
    autoTable(doc, {
      startY: y,
      head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
      body,
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237] },
      margin: { left: 14, right: 14 },
    })
    doc.save(`Guest_Statement_${booking.bookingNumber || 'booking'}.pdf`)
  }

  const handleExcel = () => {
    if (!booking) {
      setError('Select a guest first.')
      return
    }
    const wb = XLSX.utils.book_new()
    const wsData = [
      ['Guest Statement'],
      ['Guest', booking.guestName],
      ['Room', booking.roomNumber],
      [
        'Stay',
        `${booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''} - ${
          booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''
        }`,
      ],
      [],
      ['Date', 'Description', 'Debit', 'Credit', 'Balance'],
      ...filtered.map((t) => [
        t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-',
        t.description || t.type || '-',
        t.isDebit ? Number(t.amount || 0).toFixed(2) : '-',
        !t.isDebit ? Number(t.amount || 0).toFixed(2) : '-',
        Number(t.balance ?? 0).toFixed(2),
      ]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Statement')
    XLSX.writeFile(wb, `Guest_Statement_${booking.bookingNumber || 'booking'}.xlsx`)
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-purple-900 text-base flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Guest Statement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length > 0 && (
          <div>
            <Label>Select guest</Label>
            <select
              value={booking?.id || ''}
              onChange={(e) => {
                const id = e.target.value
                const selected = bookings.find((b) => b.id === id)
                if (selected && onSelectBooking) onSelectBooking(selected)
                setError('')
              }}
              className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Choose guest</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.guestName} · Room {b.roomNumber} ({b.bookingNumber})
                </option>
              ))}
            </select>
          </div>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>From</Label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <Label>To</Label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePDF} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm">
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button onClick={handleExcel} variant="outline" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 text-sm">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
