'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModulePermissionCard } from './ModulePermissionCard'

const DEFAULT_STRUCTURE = [
  { module: 'Reservations', pages: ['Dashboard', 'New Reservation', 'Reservation List'] },
  { module: 'Housekeeping', pages: ['Tasks', 'Inspections'] },
  { module: 'Billing', pages: ['Room Bills', 'Restaurant Bills', 'Combined Bills'] },
  { module: 'HR', pages: ['Staff List', 'Attendance', 'Roles & Permissions'] },
]

function buildMatrix(role) {
  if (!role?.matrix?.length) {
    return DEFAULT_STRUCTURE.map((m) => ({
      module: m.module,
      pages: m.pages.map((p) => ({ page: p, actions: [] })),
    }))
  }
  return role.matrix
}

export function RolePermissionsPanel({ role, onChange, saving, error }) {
  const [matrix, setMatrix] = useState(() => buildMatrix(role))

  useEffect(() => {
    setMatrix(buildMatrix(role))
  }, [role])

  const handleModuleChange = (moduleName, pages) => {
    const next = matrix.map((m) => (m.module === moduleName ? { ...m, pages } : m))
    setMatrix(next)
    onChange?.(next)
  }

  if (!role) {
    return (
      <Card className="border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-600">
          Select a role from the list to view and edit its permissions.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Permissions for {role.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 text-[11px] text-slate-600 space-y-1">
          <p>Toggle actions to grant or revoke access for each module and page.</p>
          {error && <p className="text-red-600 font-medium">{error}</p>}
        </CardContent>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {matrix.map((m) => (
          <ModulePermissionCard
            key={m.module}
            moduleName={m.module}
            pages={m.pages}
            onChange={(pages) => handleModuleChange(m.module, pages)}
            disabled={saving}
          />
        ))}
      </div>
    </div>
  )
}

