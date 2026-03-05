'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'

export default function ExportSummary({ onExportPDF, onExportExcel, loading = false }) {
  const handlePDFExport = () => {
    if (onExportPDF) {
      onExportPDF()
    }
  }

  const handleExcelExport = () => {
    if (onExportExcel) {
      onExportExcel()
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Export Inventory Summary</h3>
            <p className="text-sm text-gray-600">Download comprehensive inventory reports</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handlePDFExport}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Export PDF
            </Button>
            <Button
              onClick={handleExcelExport}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 mr-2" />
              )}
              Export Excel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
