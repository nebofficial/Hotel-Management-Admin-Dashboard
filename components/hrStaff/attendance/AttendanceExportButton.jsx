'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportAttendance } from '@/services/api/attendanceApi'

export function AttendanceExportButton({ apiBase, from, to }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      await exportAttendance(apiBase, { from, to, format: 'pdf' })
      // For now just fire and forget; front-end could open a new window or download file once implemented.
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="gap-1.5 h-8 text-xs"
      disabled={loading || !from || !to}
      onClick={handleExport}
    >
      <Download className="w-4 h-4" />
      Export
    </Button>
  )
}

