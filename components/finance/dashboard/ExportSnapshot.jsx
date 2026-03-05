'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function ExportSnapshot({ data, onExportPDF, onExportExcel }) {
  const handlePDF = () => {
    if (onExportPDF) {
      onExportPDF()
      return
    }
    try {
      const doc = new jsPDF()
      const w = doc.internal.pageSize.getWidth()
      doc.setFontSize(18)
      doc.text('Finance Dashboard Snapshot', w / 2, 20, null, null, 'center')
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, w / 2, 28, null, null, 'center')
      let y = 40
      const rows = [
        ['Total Revenue', `$${Number(data?.totalRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
        ['Total Expenses', `$${Number(data?.totalExpenses ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
        ['Net Profit', `$${Number(data?.netProfit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
      ]
      autoTable(doc, { startY: y, head: [['Metric', 'Value']], body: rows, theme: 'grid', headStyles: { fillColor: [16, 185, 129] }, margin: { left: 14, right: 14 } })
      doc.save(`Finance_Snapshot_${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (e) {
      console.error(e)
      alert('Failed to export PDF.')
    }
  }

  const handleExcel = () => {
    if (onExportExcel) {
      onExportExcel()
      return
    }
    try {
      const wb = XLSX.utils.book_new()
      const wsData = [
        ['Finance Dashboard Summary'],
        ['Generated', new Date().toLocaleString()],
        [],
        ['Metric', 'Value'],
        ['Total Revenue', data?.totalRevenue ?? 0],
        ['Total Expenses', data?.totalExpenses ?? 0],
        ['Net Profit', data?.netProfit ?? 0],
      ]
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      XLSX.utils.book_append_sheet(wb, ws, 'Summary')
      XLSX.writeFile(wb, `Finance_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch (e) {
      console.error(e)
      alert('Failed to export Excel.')
    }
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-teal-900 text-base">
          <Download className="h-5 w-5" />
          Export Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={handlePDF} variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50">
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button onClick={handleExcel} variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
