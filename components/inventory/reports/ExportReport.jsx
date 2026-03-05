'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'

export default function ExportReport({ onExportPDF, onExportExcel }) {
  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 rounded-2xl shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-teal-900 text-base">
          <Download className="h-5 w-5" />
          Export Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={onExportPDF} variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50">
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button onClick={onExportExcel} variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
