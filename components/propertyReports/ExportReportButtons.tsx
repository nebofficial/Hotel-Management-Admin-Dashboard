"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportReportButtonsProps {
  onExport: () => Promise<void>
  loading?: boolean
}

export function ExportReportButtons({ onExport, loading }: ExportReportButtonsProps) {
  const handleClick = async () => {
    await onExport()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Export Reports</h3>
      <p className="mb-3 text-xs text-slate-600">
        Export the current property report for the selected date range.
      </p>
      <Button
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {loading ? "Exporting..." : "Export (PDF/Excel)"}
      </Button>
    </div>
  )
}

