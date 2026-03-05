'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function ExportReport({
  rows = [],
  totalDebit = 0,
  totalCredit = 0,
  asOf = new Date().toISOString(),
}) {
  const fmt = (n) =>
    n > 0
      ? Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : ''

  const dateStr = new Date(asOf).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handlePDF = () => {
    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Trial Balance', w / 2, 16, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`As of ${dateStr}`, w / 2, 24, { align: 'center' })

    const body = rows.map((r) => [
      r.code || '-',
      r.name || '-',
      r.debit > 0 ? fmt(r.debit) : '',
      r.credit > 0 ? fmt(r.credit) : '',
    ])
    if (rows.length > 0) {
      body.push(['', 'Total', fmt(totalDebit), fmt(totalCredit)])
    }

    autoTable(doc, {
      startY: 32,
      head: [['Code', 'Account', 'Debit', 'Credit']],
      body,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    })

    doc.save(`Trial_Balance_${asOf.slice(0, 10)}.pdf`)
  }

  const handleExcel = () => {
    const wb = XLSX.utils.book_new()
    const wsData = [
      ['Trial Balance'],
      ['As of', dateStr],
      [],
      ['Code', 'Account', 'Debit', 'Credit'],
      ...rows.map((r) => [
        r.code || '-',
        r.name || '-',
        r.debit > 0 ? Number(r.debit) : '',
        r.credit > 0 ? Number(r.credit) : '',
      ]),
      ['', 'Total', Number(totalDebit), Number(totalCredit)],
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Trial Balance')
    XLSX.writeFile(wb, `Trial_Balance_${asOf.slice(0, 10)}.xlsx`)
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-teal-900 text-base">
          <Download className="h-5 w-5" />
          Export Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            onClick={handlePDF}
            variant="outline"
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50 text-sm"
          >
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button
            onClick={handleExcel}
            variant="outline"
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50 text-sm"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
