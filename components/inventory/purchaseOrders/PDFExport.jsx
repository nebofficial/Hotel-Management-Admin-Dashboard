'use client'

import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

export default function PDFExport({ order, onExport }) {
  if (!order) return null

  const handleExport = () => {
    if (onExport) {
      onExport(order)
    } else {
      // Fallback: open print dialog
      window.print()
    }
  }

  return (
    <Button
      type="button"
      onClick={handleExport}
      className="w-full bg-red-600 hover:bg-red-700 text-white"
    >
      <FileText className="h-4 w-4 mr-2" />
      Export as PDF
    </Button>
  )
}
