'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionPermissionToggle } from './ActionPermissionToggle'

const DEFAULT_ACTIONS = ['view', 'create', 'edit', 'delete']

export function ModulePermissionCard({ moduleName, pages, onChange, disabled }) {
  const handleToggle = (page, action, enabled) => {
    const next = pages.map((p) => {
      if (p.page !== page) return p
      const actions = new Set(p.actions || [])
      if (enabled) actions.add(action)
      else actions.delete(action)
      return { ...p, actions: Array.from(actions) }
    })
    onChange?.(next)
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-violet-100 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-violet-900">{moduleName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-1 space-y-1 text-[11px] text-slate-700">
        {pages.map((p) => (
          <div key={p.page} className="flex items-center justify-between border-b border-violet-100/70 pb-0.5">
            <span className="font-medium">{p.page}</span>
            <div className="flex gap-1">
              {DEFAULT_ACTIONS.map((a) => (
                <ActionPermissionToggle
                  key={a}
                  label={a}
                  enabled={p.actions?.includes(a)}
                  onChange={(val) => handleToggle(p.page, a, val)}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

