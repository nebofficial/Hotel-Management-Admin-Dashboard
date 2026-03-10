'use client'

import { Button } from '@/components/ui/button'
import { ShieldPlus } from 'lucide-react'

export function RolesHeader({ onCreate }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Roles & Permissions</h2>
        <p className="text-xs text-slate-600 mt-1">
          Configure role-based access, module permissions, and staff role assignments.
        </p>
      </div>
      <Button type="button" size="sm" className="gap-1.5 text-xs" onClick={onCreate}>
        <ShieldPlus className="w-4 h-4" />
        Create Role
      </Button>
    </div>
  )
}

