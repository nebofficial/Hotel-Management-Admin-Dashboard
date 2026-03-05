'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function BillingDashboardExport({ data, startDate, endDate }) {
  const handlePDF = () => {
    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    doc.setFontSize(18)
    doc.text('Billing Dashboard Summary', w / 2, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.text(
      `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      w / 2,
      28,
      { align: 'center' }
    )

    const rows = [
      ['Total Bills', data?.kpis?.totalBills ?? 0],
      ['Total Billed Amount', '₹' + Number(data?.kpis?.totalBilledAmount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })],
      ['Paid Bills', data?.kpis?.paidBills ?? 0],
      ['Pending Amount', '₹' + Number(data?.kpis?.pendingAmount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })],
      ['Collection %', (data?.paymentStatus?.collectionPercent ?? 0) + '%'],
      ['Net Revenue', '₹' + Number(data?.refundCreditNote?.netAdjustedRevenue ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })],
    ]

    autoTable(doc, {
      startY: 38,
      head: [['Metric', 'Value']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    })

    doc.save(`Billing_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const handleExcel = () => {
    const wb = XLSX.utils.book_new()
    const wsData = [
      ['Billing Dashboard Summary'],
      ['Period', `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`],
      [],
      ['Metric', 'Value'],
      ['Total Bills', data?.kpis?.totalBills ?? 0],
      ['Total Billed Amount', data?.kpis?.totalBilledAmount ?? 0],
      ['Paid Bills', data?.kpis?.paidBills ?? 0],
      ['Pending Amount', data?.kpis?.pendingAmount ?? 0],
      ['Collection %', data?.paymentStatus?.collectionPercent ?? 0],
      ['Net Revenue', data?.refundCreditNote?.netAdjustedRevenue ?? 0],
    ]

    const txData = [
      ['Recent Transactions'],
      ['Invoice #', 'Guest', 'Bill Type', 'Amount', 'Status', 'Date'],
      ...(data?.recentTransactions || []).map((t) => [
        t.invoiceNumber,
        t.guestName,
        t.billType,
        t.amount,
        t.paymentStatus,
        new Date(t.date || t.createdAt).toLocaleDateString(),
      ]),
    ]

    const ws1 = XLSX.utils.aoa_to_sheet(wsData)
    const ws2 = XLSX.utils.aoa_to_sheet(txData)
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary')
    XLSX.utils.book_append_sheet(wb, ws2, 'Transactions')
    XLSX.writeFile(wb, `Billing_Dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`)
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
