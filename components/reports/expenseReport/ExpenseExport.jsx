'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportExpenseReport } from '@/services/api/expenseReportApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const formatNum = (v) => (v != null && !isNaN(Number(v)) ? Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-')

export function ExpenseExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportExpenseReport(apiBase, filters || {})
      if (type === 'pdf') exportPdf(payload)
      else exportExcel(payload)
    } catch (err) {
      console.error('Expense export error:', err)
      alert(err?.message || 'Failed to export expense report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Expense Report</p>
      <p className="text-[11px] opacity-90">Download expense report as PDF or Excel.</p>
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
  doc.text('Expense Report', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 24, { align: 'center' })

  const { summary = {}, breakdown = [], byCategory = [], filters = {} } = payload || {}
  const rows = [
    ['Total Expenses', formatNum(summary.totalExpenses)],
    ['Total Vendor Payments', formatNum(summary.totalVendorPayments)],
    ['Expense Count', String(summary.expenseCount ?? 0)],
  ]
  autoTable(doc, {
    startY: 32,
    head: [['Metric', 'Value']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14, right: 14 },
  })

  if (breakdown?.length > 0 && doc.lastAutoTable.finalY < 240) {
    doc.setFontSize(12)
    doc.text('Expense Breakdown', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Date', 'Category', 'Amount', 'Vendor']],
      body: breakdown.slice(0, 25).map((r) => [
        r.date || '-',
        String(r.category || '-').slice(0, 12),
        formatNum(r.amount),
        String(r.vendor || '-').slice(0, 15),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }
  doc.save(`Expense_Report_${filters?.startDate || new Date().toISOString().slice(0, 10)}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { summary = {}, breakdown = [], byCategory = [], filters = {} } = payload || {}

  const summaryData = [
    ['Expense Report Summary'],
    ['Generated', new Date().toLocaleString()],
    ['Period', `${filters?.startDate || '-'} to ${filters?.endDate || '-'}`],
    [],
    ['Metric', 'Value'],
    ['Total Expenses', summary.totalExpenses],
    ['Total Vendor Payments', summary.totalVendorPayments],
    ['Expense Count', summary.expenseCount],
  ]
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), 'Summary')

  if (byCategory?.length > 0) {
    const catData = [['Category', 'Amount'], ...byCategory.map((r) => [r.name, r.value])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(catData), 'By Category')
  }
  if (breakdown?.length > 0) {
    const bdData = [
      ['Date', 'Category', 'Amount', 'Vendor', 'Payment Method', 'Description'],
      ...breakdown.map((r) => [r.date, r.category, r.amount, r.vendor, r.paymentMethod, r.description]),
    ]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(bdData), 'Breakdown')
  }
  XLSX.writeFile(workbook, `Expense_Report_${filters?.startDate || new Date().toISOString().slice(0, 10)}.xlsx`)
}
