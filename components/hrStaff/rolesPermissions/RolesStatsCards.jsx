'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RolesStatsCards({ roles, staffCount }) {
  const totalRoles = roles?.length || 0
  const activeRoles = totalRoles // placeholder; extend when adding status
  const modulesWithPermissions = new Set()
  let assignedStaff = staffCount ?? 0

  roles?.forEach((r) => {
    ;(r.permissions || []).forEach((p) => {
      const [mod] = String(p).split(':')
      if (mod) modulesWithPermissions.add(mod)
    })
  })

  const cards = [
    {
      label: 'Total Roles',
      value: totalRoles,
      gradient: 'from-emerald-500/90 to-mint-400',
    },
    {
      label: 'Active Roles',
      value: activeRoles,
      gradient: 'from-sky-500/90 to-blue-500',
    },
    {
      label: 'Modules with Permissions',
      value: modulesWithPermissions.size,
      gradient: 'from-violet-500/90 to-purple-500',
    },
    {
      label: 'Staff Assigned',
      value: assignedStaff,
      gradient: 'from-amber-500/90 to-yellow-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={`bg-gradient-to-br ${c.gradient} text-white shadow-md border-none rounded-2xl`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium tracking-wide uppercase opacity-90">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

