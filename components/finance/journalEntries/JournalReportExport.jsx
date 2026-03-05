'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function JournalReportExport({ entries }) {
  const handleExportPDF = () => {
    if (!entries || entries.length === 0) {
      alert('No journal entries to export.')
      return
    }
    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()
    doc.setFontSize(14)
    doc.text('Journal Entries Report', w / 2, 16, { align: 'center' })
    doc.setFontSize(10)

    let y = 24
    entries.slice(0, 50).forEach((e) => {
      if (y > 270) {
        doc.addPage()
        y = 16
      }
      doc.text(`${e.voucherNumber} · ${e.date} · ${e.narration || ''}`, 14, y)
      y += 5
      doc.text(
        `Debit: ₹${Number(e.totalDebit || 0).toFixed(2)}  Credit: ₹${Number(
          e.totalCredit || 0
        ).toFixed(2)}`,
        18,
        y
      )
      y += 6
    })

    doc.save('JournalEntries.pdf')
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-slate-50">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          Journal Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          size="sm"
          onClick={handleExportPDF}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-xs"
        >
          Export PDF
        </Button>
      </CardContent>
    </Card>
  )
}

