'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportRevenueReport } from '@/services/api/revenueReportApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function RevenueExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportRevenueReport(apiBase, filters || {})
      if (type === 'pdf') {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Revenue Report', 105, 18, { align: 'center' })
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 24, { align: 'center' })
        const s = payload.summary || {}
        const rows = [['Total Revenue', s.totalRevenue], ['Room Revenue', s.roomRevenue], ['Restaurant Revenue', s.restaurantRevenue]]
        autoTable(doc, { startY: 32, head: [['Metric', 'Value']], body: rows, theme: 'grid', headStyles: { fillColor: [16, 185, 129] } })
        const daily = payload.daily || []
        if (daily.length > 0) {
          autoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [['Date', 'Revenue']], body: daily.slice(0, 30).map((r) => [r.date, r.total]), theme: 'striped', headStyles: { fillColor: [59, 130, 246] }, bodyStyles: { fontSize: 8 } })
        }
        doc.save(`Revenue_Report_${(payload.filters?.startDate || '').slice(0, 10) || 'export'}.pdf`)
      } else {
        const wb = XLSX.utils.book_new()
        const s = payload.summary || {}
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Revenue Report'], ['Generated', new Date().toLocaleString()], [], ['Metric', 'Value'], ['Total Revenue', s.totalRevenue], ['Room Revenue', s.roomRevenue], ['Restaurant Revenue', s.restaurantRevenue]]), 'Summary')
        const daily = payload.daily || []
        if (daily.length > 0) {
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Date', 'Revenue'], ...daily.map((r) => [r.date, r.total])]), 'Daily')
        }
        XLSX.writeFile(wb, `Revenue_Report_${(payload.filters?.startDate || '').slice(0, 10) || 'export'}.xlsx`)
      }
    } catch (err) {
      console.error('Export error:', err)
      alert(err?.message || 'Failed to export')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Revenue Report</p>
      <p className="text-[11px] opacity-90">Download as PDF or Excel.</p>
      <div className="flex gap-2">
        <Button type="button" size="sm" className="h-8 text-[11px] bg-amber-950/70 hover:bg-amber-900/90 gap-1.5" onClick={() => handleExport('pdf')} disabled={exporting}>
          <FileDown className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'PDF'}
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px] border-amber-100 text-amber-50 hover:bg-amber-900/40 gap-1.5" onClick={() => handleExport('excel')} disabled={exporting}>
          <FileSpreadsheet className="w-4 h-4" />
          Excel
        </Button>
      </div>
    </div>
  )
}
