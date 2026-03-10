'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'

export function AuditLogsExport({ apiBase, filters, combinedLogs = [] }) {
  const exportPdf = () => {
    const doc = new jsPDF('l', 'pt')
    doc.setFontSize(14)
    doc.text('Audit Logs Report', 40, 40)
    const subtitle = []
    if (filters?.startDate) subtitle.push(`From: ${filters.startDate}`)
    if (filters?.endDate) subtitle.push(`To: ${filters.endDate}`)
    if (subtitle.length) {
      doc.setFontSize(10)
      doc.text(subtitle.join('   '), 40, 58)
    }

    const rows = combinedLogs.map((log) => [
      log.createdAt || log.timestamp || log.loginTime || '',
      log.userName || '',
      log.module || log.type || '',
      log.action || log.status || '',
      log.description ||
        (typeof log.details === 'string'
          ? log.details
          : log.details
          ? JSON.stringify(log.details)
          : ''),
    ])

    autoTable(doc, {
      startY: 80,
      head: [['Timestamp', 'User', 'Module', 'Action', 'Details']],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 64, 175] },
    })

    doc.save('audit-logs-report.pdf')
  }

  const exportExcel = () => {
    const rows = combinedLogs.map((log) => ({
      Timestamp: log.createdAt || log.timestamp || log.loginTime || '',
      User: log.userName || '',
      Module: log.module || log.type || '',
      Action: log.action || log.status || '',
      Details:
        log.description ||
        (typeof log.details === 'string'
          ? log.details
          : log.details
          ? JSON.stringify(log.details)
          : ''),
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs')
    XLSX.writeFile(wb, 'audit-logs.xlsx')
  }

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button
        type="button"
        size="sm"
        className="h-8 text-xs bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white shadow-sm"
        onClick={exportPdf}
      >
        <FileDown className="w-3.5 h-3.5 mr-1.5" />
        PDF
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 text-xs border-amber-700/60 text-amber-800"
        onClick={exportExcel}
      >
        <FileDown className="w-3.5 h-3.5 mr-1.5" />
        Excel
      </Button>
    </div>
  )
}

