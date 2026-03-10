'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function ShiftExportButton({ apiBase, weekStart, onExport }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!apiBase || !onExport) return
    setLoading(true)
    try {
      const data = await onExport(apiBase, { weekStart: weekStart || new Date().toISOString().slice(0, 10) })
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `shift-schedule-${weekStart || 'export'}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" className="h-8 text-xs gap-1.5" disabled={loading} onClick={handleExport}>
      <Download className="w-3.5 h-3.5" />
      {loading ? 'Exporting...' : 'Export Schedule'}
    </Button>
  )
}
