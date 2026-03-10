'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportRestaurantSalesReport } from '@/services/api/restaurantSalesApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const formatNum = (v) => (v != null && !isNaN(Number(v)) ? Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-');

export function RestaurantSalesExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportRestaurantSalesReport(apiBase, filters || {})
      if (type === 'pdf') exportPdf(payload)
      else exportExcel(payload)
    } catch (err) {
      console.error('Restaurant sales export error:', err)
      alert(err?.message || 'Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Report</p>
      <p className="text-[11px] opacity-90">Download restaurant sales report as PDF or Excel.</p>
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
  doc.text('Restaurant Sales Report', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 24, { align: 'center' })

  const { summary = {}, daily = [], itemWise = [] } = payload || {}
  const rows = [
    ['Total Restaurant Revenue', formatNum(summary.totalRestaurantRevenue)],
    ['Total Orders', formatNum(summary.totalOrders)],
    ['Average Order Value', formatNum(summary.averageOrderValue)],
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
    doc.setFontSize(12)
    doc.text('Daily Sales', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Date', 'Total Sales']],
      body: daily.slice(0, 25).map((r) => [r.date, formatNum(r.totalSales)]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    })
  }
  if (itemWise.length > 0 && doc.lastAutoTable.finalY < 250) {
    doc.setFontSize(12)
    doc.text('Top Items', 14, doc.lastAutoTable.finalY + 12)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Item', 'Qty', 'Revenue']],
      body: itemWise.slice(0, 20).map((r) => [r.itemName, String(r.quantitySold), formatNum(r.totalRevenue)]),
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237] },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }
  doc.save(`Restaurant_Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { summary = {}, daily = [], itemWise = [], paymentAnalysis = [] } = payload || {}

  const summaryData = [
    ['Restaurant Sales Report Summary'],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Metric', 'Value'],
    ['Total Restaurant Revenue', summary.totalRestaurantRevenue],
    ['Total Orders', summary.totalOrders],
    ['Average Order Value', summary.averageOrderValue],
  ]
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), 'Summary')

  if (daily.length > 0) {
    const dailyData = [['Date', 'Total Sales'], ...daily.map((r) => [r.date, r.totalSales])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(dailyData), 'Daily')
  }
  if (itemWise.length > 0) {
    const itemData = [['Item', 'Qty Sold', 'Revenue'], ...itemWise.map((r) => [r.itemName, r.quantitySold, r.totalRevenue])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(itemData), 'Item-wise')
  }
  if (paymentAnalysis.length > 0) {
    const payData = [['Method', 'Amount'], ...paymentAnalysis.map((r) => [r.method, r.amount])]
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(payData), 'Payment')
  }
  XLSX.writeFile(workbook, `Restaurant_Sales_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
