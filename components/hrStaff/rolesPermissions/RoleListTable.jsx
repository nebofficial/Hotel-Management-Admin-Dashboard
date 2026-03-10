'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleRow } from './RoleRow'

export function RoleListTable({ roles, loading, onEdit, onSelect }) {
  return (
    <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-900">
          Roles ({roles?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading roles…</div>
        ) : !roles?.length ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No roles created yet. Use “Create Role” to add your first role.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                  <th className="py-2 px-2 text-left font-medium">Role</th>
                  <th className="py-2 px-2 text-left font-medium">Description</th>
                  <th className="py-2 px-2 text-left font-medium">Modules</th>
                  <th className="py-2 px-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <RoleRow key={r.id} role={r} onEdit={onEdit} onSelect={onSelect} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

