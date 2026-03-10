'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShiftRow } from './ShiftRow'

export function ShiftListTable({ shifts, loading, onEdit, onAssign }) {
  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-sky-50 to-blue-50">
        <CardTitle className="text-sm font-semibold text-slate-900">Shift List</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading shifts…</div>
        ) : !shifts?.length ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No shifts created yet. Use “Create Shift” to add your first shift.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                  <th className="py-2 px-2 text-left font-medium">ID</th>
                  <th className="py-2 px-2 text-left font-medium">Name</th>
                  <th className="py-2 px-2 text-left font-medium">Time</th>
                  <th className="py-2 px-2 text-left font-medium">Break</th>
                  <th className="py-2 px-2 text-left font-medium">Type</th>
                  <th className="py-2 px-2 text-left font-medium">Status</th>
                  <th className="py-2 px-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <ShiftRow key={s.id} shift={s} onEdit={onEdit} onAssign={onAssign} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
