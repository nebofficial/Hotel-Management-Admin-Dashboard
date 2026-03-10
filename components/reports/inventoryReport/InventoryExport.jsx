'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportInventoryReport } from '@/services/api/inventoryReportApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function InventoryExport({ apiBase, filters }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    if (!apiBase || exporting) return
    setExporting(true)
    try {
      const payload = await exportInventoryReport(apiBase, filters || {})
      if (type === 'pdf') {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Inventory Report', 105, 18, { align: 'center' })
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 24, { align: 'center' })
        const s = payload.summary || {}
        const rows = [['Total Items', s.totalItems], ['Total Value', s.totalInventoryValue], ['Low Stock', s.lowStockItems]]
        autoTable(doc, { startY: 32, head: [['Metric', 'Value']], body: rows, theme: 'grid', headStyles: { fillColor: [16, 185, 129] } })
        const cs = payload.currentStock || []
        if (cs.length > 0) {
          autoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [['Item', 'Category', 'Qty', 'Value']], body: cs.slice(0, 30).map((r) => [r.itemName, r.category, r.currentQuantity, r.totalValue]), theme: 'striped', headStyles: { fillColor: [59, 130, 246] }, bodyStyles: { fontSize: 8 } })
        }
        doc.save(`Inventory_Report_${(payload.filters?.startDate || '').slice(0, 10) || 'export'}.pdf`)
      } else {
        const wb = XLSX.utils.book_new()
        const s = payload.summary || {}
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Inventory Report'], ['Generated', new Date().toLocaleString()], [], ['Metric', 'Value'], ['Total Items', s.totalItems], ['Total Value', s.totalInventoryValue]]), 'Summary')
        const cs = payload.currentStock || []
        if (cs.length > 0) {
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Item', 'Category', 'Qty', 'Value'], ...cs.map((r) => [r.itemName, r.category, r.currentQuantity, r.totalValue])]), 'Stock')
        }
        XLSX.writeFile(wb, `Inventory_Report_${(payload.filters?.startDate || '').slice(0, 10) || 'export'}.xlsx`)
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
      <p className="text-xs font-semibold uppercase tracking-wide">Export Inventory Report</p>
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
