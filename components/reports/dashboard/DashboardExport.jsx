'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportDashboardReport } from '@/services/api/reportsDashboardApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function DashboardExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportDashboardReport(apiBase, filters || {})
      if (type === 'pdf') {
        exportPdf(payload)
      } else {
        exportExcel(payload)
      }
    } catch (err) {
      console.error('Dashboard export error:', err)
      alert(err?.message || 'Failed to export dashboard report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500 text-amber-50 p-4 space-y-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide">Export Dashboard</p>
      <p className="text-[11px] opacity-90">
        Download a summary of key KPIs, revenue, occupancy, sales, and expenses for the selected period.
      </p>
      <div className="flex flex-wrap gap-2">
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
          {exporting ? 'Preparing...' : 'Excel'}
        </Button>
      </div>
    </div>
  )
}

function exportPdf(payload) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFontSize(18)
  doc.text('Hotel Reports Dashboard', pageWidth / 2, 18, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 25, { align: 'center' })

  const { revenueSummary = {}, occupancyStats = {}, restaurantSales = {}, expenseSummary = {} } = payload || {}

  const summaryRows = [
    ['Total Revenue', formatNumber(revenueSummary.totalRevenue)],
    ['Room Revenue', formatNumber(revenueSummary.roomRevenue)],
    ['Restaurant Revenue', formatNumber(revenueSummary.restaurantRevenue)],
    ['Other Services Revenue', formatNumber(revenueSummary.otherServicesRevenue)],
    ['Occupancy Rate (Today)', `${Number(occupancyStats.occupancyRateToday || 0).toFixed(1)} %`],
    ['Rooms Occupied (Today)', String(occupancyStats.roomsOccupiedToday || 0)],
    ['Total Restaurant Sales', formatNumber(restaurantSales.totalSales)],
    ['Average Order Value', formatNumber(restaurantSales.avgOrderValue)],
    ['Total Expenses', formatNumber(expenseSummary.totalExpenses)],
    ['Operational Costs', formatNumber(expenseSummary.operationalCosts)],
    ['Maintenance Costs', formatNumber(expenseSummary.maintenanceCosts)],
  ]

  autoTable(doc, {
    startY: 35,
    head: [['Metric', 'Value']],
    body: summaryRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175] },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  })

  doc.save(`Reports_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`)
}

function exportExcel(payload) {
  const workbook = XLSX.utils.book_new()
  const { revenueSummary = {}, occupancyStats = {}, restaurantSales = {}, expenseSummary = {} } = payload || {}

  const sheetData = [
    ['Reports Dashboard Summary'],
    ['Generated on', new Date().toLocaleString()],
    [],
    ['Metric', 'Value'],
    ['Total Revenue', formatNumber(revenueSummary.totalRevenue)],
    ['Room Revenue', formatNumber(revenueSummary.roomRevenue)],
    ['Restaurant Revenue', formatNumber(revenueSummary.restaurantRevenue)],
    ['Other Services Revenue', formatNumber(revenueSummary.otherServicesRevenue)],
    ['Occupancy Rate (Today)', `${Number(occupancyStats.occupancyRateToday || 0).toFixed(1)} %`],
    ['Rooms Occupied (Today)', String(occupancyStats.roomsOccupiedToday || 0)],
    ['Total Restaurant Sales', formatNumber(restaurantSales.totalSales)],
    ['Average Order Value', formatNumber(restaurantSales.avgOrderValue)],
    ['Total Expenses', formatNumber(expenseSummary.totalExpenses)],
    ['Operational Costs', formatNumber(expenseSummary.operationalCosts)],
    ['Maintenance Costs', formatNumber(expenseSummary.maintenanceCosts)],
  ]

  const sheet = XLSX.utils.aoa_to_sheet(sheetData)
  XLSX.utils.book_append_sheet(workbook, sheet, 'Dashboard')
  XLSX.writeFile(workbook, `Reports_Dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

function formatNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return '-'
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

