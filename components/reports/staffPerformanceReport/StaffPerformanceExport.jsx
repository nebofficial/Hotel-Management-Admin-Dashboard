'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportStaffPerformanceReport } from '@/services/api/staffPerformanceApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const formatNum = (v) =>
  v != null && !Number.isNaN(Number(v))
    ? Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })
    : '-'

export function StaffPerformanceExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportStaffPerformanceReport(apiBase, filters || {})
      if (type === 'pdf') exportPdf(payload)
      else exportExcel(payload)
    } catch (err) {
      console.error('Staff performance export error:', err)
      alert(err?.message || 'Failed to export staff performance report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Performance Report</p>
      <p className="text-[11px] opacity-90">Download as PDF or Excel.</p>
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
  doc.text('Staff Performance Report', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 24, { align: 'center' })

  const { attendance = [], commissions = [], filters = {} } = payload || {}

  const attSummary = attendance.slice(0, 25)
  if (attSummary.length) {
    autoTable(doc, {
      startY: 32,
      head: [['Staff', 'Department', 'Date', 'Status', 'Shift']],
      body: attSummary.map((r) => [r.staffName, r.department || '-', r.date, r.status, r.shift]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }

  if (commissions.length && doc.lastAutoTable) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Staff', 'Department', 'Service', 'Base', 'Commission']],
      body: commissions.slice(0, 25).map((c) => [
        c.staffName,
        c.department || '-',
        c.serviceType,
        formatNum(c.baseAmount),
        formatNum(c.commissionAmount),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }

  const period =
    filters?.startDate && filters?.endDate
      ? `${filters.startDate} to ${filters.endDate}`
      : 'Selected period'
  doc.text(period, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })

  doc.save(`Staff_Performance_${(filters?.startDate || new Date().toISOString().slice(0, 10))}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { attendance = [], commissions = [], filters = {} } = payload || {}

  const summarySheet = [
    ['Staff Performance Report'],
    ['Generated', new Date().toLocaleString()],
    ['Period', `${filters?.startDate || '-'} to ${filters?.endDate || '-'}`],
  ]
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summarySheet), 'Summary')

  if (attendance.length) {
    const attData = [
      ['Staff', 'Department', 'Date', 'Status', 'Shift'],
      ...attendance.map((r) => [r.staffName, r.department, r.date, r.status, r.shift]),
    ]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(attData), 'Attendance')
  }

  if (commissions.length) {
    const comData = [
      ['Staff', 'Department', 'Service', 'Base Amount', 'Commission Amount', 'Date'],
      ...commissions.map((c) => [
        c.staffName,
        c.department,
        c.serviceType,
        c.baseAmount,
        c.commissionAmount,
        c.transactionDate,
      ]),
    ]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(comData), 'Commissions')
  }

  XLSX.writeFile(
    workbook,
    `Staff_Performance_${(filters?.startDate || new Date().toISOString().slice(0, 10))}.xlsx`,
  )
}

