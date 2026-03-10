'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportOccupancyReport } from '@/services/api/occupancyReportApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function OccupancyExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportOccupancyReport(apiBase, filters || {})
      if (type === 'pdf') exportPdf(payload)
      else exportExcel(payload)
    } catch (err) {
      console.error('Occupancy export error:', err)
      alert(err?.message || 'Failed to export occupancy report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Report</p>
      <p className="text-[11px] opacity-90">Download occupancy report as PDF or Excel.</p>
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
  doc.text('Occupancy Report', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 24, { align: 'center' })

  const { summary = {}, daily = [] } = payload || {}
  const rows = [
    ['Total Rooms', String(summary.totalRooms)],
    ['Rooms Occupied Today', String(summary.roomsOccupiedToday)],
    ['Rooms Available', String(summary.roomsAvailableToday)],
    ['Occupancy Rate %', `${Number(summary.occupancyRateToday || 0).toFixed(1)}`],
  ]
  autoTable(doc, {
    startY: 32,
    head: [['Metric', 'Value']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14, right: 14 },
  })

  if (daily.length > 0) {
    const y = doc.lastAutoTable.finalY + 10
    if (y > 250) doc.addPage()
    doc.setFontSize(12)
    doc.text('Daily Occupancy', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Date', 'Available', 'Occupied', 'Occupancy %']],
      body: daily.slice(0, 40).map((r) => [r.date, String(r.roomsAvailable), String(r.roomsOccupied), `${r.occupancyPercentage}%`]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    })
  }
  doc.save(`Occupancy_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { summary = {}, daily = [], monthly = [] } = payload || {}
  const summaryData = [
    ['Occupancy Report Summary'],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Metric', 'Value'],
    ['Total Rooms', summary.totalRooms],
    ['Rooms Occupied Today', summary.roomsOccupiedToday],
    ['Rooms Available', summary.roomsAvailableToday],
    ['Occupancy Rate %', Number(summary.occupancyRateToday || 0).toFixed(1)],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  if (daily.length > 0) {
    const dailyData = [['Date', 'Available', 'Occupied', 'Total', 'Occupancy %'], ...daily.map((r) => [r.date, r.roomsAvailable, r.roomsOccupied, r.totalRooms, r.occupancyPercentage])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(dailyData), 'Daily')
  }
  if (monthly?.length > 0) {
    const monthData = [['Month', 'Room Nights Sold', 'Occupancy %'], ...monthly.map((r) => [r.monthLabel, r.roomNightsSold, r.occupancyPercentage])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(monthData), 'Monthly')
  }
  XLSX.writeFile(workbook, `Occupancy_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
