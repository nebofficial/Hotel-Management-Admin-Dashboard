'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function AutoGenerateClosingReport({ date, overview }) {
  const handleExport = () => {
    alert('Day closing PDF export can be implemented similar to Inventory / Finance exports.')
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Auto-generate Closing Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-teal-100">
          Date-wise summary with shift breakdown and cash difference. Use export to generate PDF.
        </p>
        <Button
          size="sm"
          onClick={handleExport}
          className="w-full bg-white text-teal-700 hover:bg-teal-50 text-xs"
        >
          Export Closing Report (PDF)
        </Button>
        <p className="text-[11px] text-teal-100">
          Selected date: <span className="font-semibold text-white">{date}</span>
        </p>
      </CardContent>
    </Card>
  )
}

