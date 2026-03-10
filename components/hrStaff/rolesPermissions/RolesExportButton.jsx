'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportRolesReport } from '@/services/api/rolesPermissionsApi'

export function RolesExportButton({ apiBase }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      await exportRolesReport(apiBase)
      // Later, implement real file download using this data
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="h-8 text-xs gap-1.5"
      disabled={loading}
      onClick={handleExport}
    >
      <Download className="w-4 h-4" />
      {loading ? 'Exporting…' : 'Export Roles'}
    </Button>
  )
}

