'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportTaxReport } from '@/services/api/taxReportApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const formatNum = (v) => (v != null && !isNaN(Number(v)) ? Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-')

export function TaxExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportTaxReport(apiBase, filters || {})
      if (type === 'pdf') exportPdf(payload)
      else exportExcel(payload)
    } catch (err) {
      console.error('Tax export error:', err)
      alert(err?.message || 'Failed to export tax report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Tax Report</p>
      <p className="text-[11px] opacity-90">Download tax report as PDF or Excel.</p>
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
  doc.text('Tax Report', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 24, { align: 'center' })

  const { summary = {}, breakdown = [], filters = {} } = payload || {}
  const rows = [
    ['Total Tax Collected', formatNum(summary.totalTaxCollected)],
    ['GST / VAT Collected', formatNum(summary.gstVatCollected)],
    ['Service Charges', formatNum(summary.serviceChargesCollected)],
    ['Taxable Revenue', formatNum(summary.totalTaxableRevenue)],
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
    doc.text('Tax Breakdown by Invoice', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Invoice', 'Customer', 'Source', 'Tax', 'Service Chg']],
      body: breakdown.slice(0, 20).map((r) => [
        String(r.invoiceNumber || '-'),
        String(r.customerName || '-').slice(0, 15),
        String(r.source || '-'),
        formatNum(r.taxAmount),
        formatNum(r.serviceCharge),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }
  doc.save(`Tax_Report_${filters?.startDate || new Date().toISOString().slice(0, 10)}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { summary = {}, breakdown = [], filters = {} } = payload || {}

  const summaryData = [
    ['Tax Report Summary'],
    ['Generated', new Date().toLocaleString()],
    ['Period', `${filters?.startDate || '-'} to ${filters?.endDate || '-'}`],
    [],
    ['Metric', 'Value'],
    ['Total Tax Collected', summary.totalTaxCollected],
    ['GST / VAT Collected', summary.gstVatCollected],
    ['Service Charges', summary.serviceChargesCollected],
    ['Taxable Revenue', summary.totalTaxableRevenue],
  ]
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), 'Summary')

  if (breakdown?.length > 0) {
    const breakdownData = [
      ['Invoice', 'Customer', 'Source', 'Tax Amount', 'Service Charge', 'Date'],
      ...breakdown.map((r) => [
        r.invoiceNumber,
        r.customerName,
        r.source,
        r.taxAmount,
        r.serviceCharge,
        r.date,
      ]),
    ]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(breakdownData), 'Breakdown')
  }
  XLSX.writeFile(workbook, `Tax_Report_${filters?.startDate || new Date().toISOString().slice(0, 10)}.xlsx`)
}
