'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportRoomRevenueReport } from '@/services/api/roomRevenueApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const formatNum = (v) => (v != null && !isNaN(Number(v)) ? Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-');

export function RoomRevenueExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportRoomRevenueReport(apiBase, filters || {})
      if (type === 'pdf') exportPdf(payload)
      else exportExcel(payload)
    } catch (err) {
      console.error('Room revenue export error:', err)
      alert(err?.message || 'Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Report</p>
      <p className="text-[11px] opacity-90">Download room revenue report as PDF or Excel.</p>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="h-8 text-[11px] bg-amber-950/70 hover:bg-amber-900/90 border border-amber-200/40 gap-1.5"
          onClick={() => handleExport('pdf')}
          disabled={exporting}
        >
          <FileDown className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'PDF'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-[11px] border-amber-100 text-amber-50 hover:bg-amber-900/40 gap-1.5"
          onClick={() => handleExport('excel')}
          disabled={exporting}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Excel
        </Button>
      </div>
    </div>
  )
}

function exportPdf(payload) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setFontSize(18)
  doc.text('Room Revenue Report', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 24, { align: 'center' })

  const { summary = {} } = payload || {}
  const rows = [
    ['Total Room Revenue', formatNum(summary.totalRoomRevenue)],
    ['Room Nights Sold', formatNum(summary.roomNightsSold)],
    ['Total Bookings', formatNum(summary.totalBookings)],
    ['ADR', formatNum(summary.adr)],
    ['RevPAR', formatNum(summary.revpar)],
  ]
  autoTable(doc, {
    startY: 32,
    head: [['Metric', 'Value']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14, right: 14 },
  })

  const { revenueByRoomType = [], details = [] } = payload || {}
  if (revenueByRoomType.length > 0) {
    doc.setFontSize(12)
    doc.text('Revenue by Room Type', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Room Type', 'Revenue']],
      body: revenueByRoomType.map((r) => [r.roomType, formatNum(r.revenue)]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    })
  }
  if (details.length > 0 && doc.lastAutoTable.finalY < 250) {
    doc.setFontSize(12)
    doc.text('Sample Details', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Bill #', 'Room', 'Type', 'Nights', 'Revenue']],
      body: details.slice(0, 25).map((r) => [r.billNumber, r.roomNumber, r.roomType, String(r.nights), formatNum(r.revenue)]),
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237] },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }
  doc.save(`Room_Revenue_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { summary = {}, revenueByRoomType = [], revenueByDate = [], details = [] } = payload || {}

  const summaryData = [
    ['Room Revenue Report Summary'],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Metric', 'Value'],
    ['Total Room Revenue', summary.totalRoomRevenue],
    ['Room Nights Sold', summary.roomNightsSold],
    ['Total Bookings', summary.totalBookings],
    ['ADR', summary.adr],
    ['RevPAR', summary.revpar],
  ]
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), 'Summary')

  if (revenueByRoomType.length > 0) {
    const rtData = [['Room Type', 'Revenue'], ...revenueByRoomType.map((r) => [r.roomType, r.revenue])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rtData), 'By Room Type')
  }
  if (revenueByDate.length > 0) {
    const rdData = [['Date', 'Revenue'], ...revenueByDate.map((r) => [r.date, r.revenue])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rdData), 'By Date')
  }
  if (details.length > 0) {
    const detData = [
      ['Bill #', 'Room', 'Type', 'Guest', 'Check-in', 'Check-out', 'Nights', 'Revenue'],
      ...details.map((r) => [r.billNumber, r.roomNumber, r.roomType, r.guestName, r.checkIn, r.checkOut, r.nights, r.revenue]),
    ]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(detData), 'Details')
  }
  XLSX.writeFile(workbook, `Room_Revenue_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
