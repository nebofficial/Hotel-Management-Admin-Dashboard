'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AssignRoomTypesPanel({ activeRule, onEditRule }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-slate-50">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Assign Seasonal Rules to Room Types
        </CardTitle>
        <p className="text-[11px] text-slate-600">
          Quickly see which room categories are covered by the selected seasonal rule.
        </p>
      </CardHeader>
      <CardContent className="p-4 text-xs">
        {!activeRule ? (
          <p className="text-slate-500">
            Select a seasonal rule from the table above to view its room type coverage.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Selected rule</p>
            <p className="font-semibold text-slate-900">{activeRule.name}</p>
            <p className="text-[11px] text-slate-600">
              Active from {activeRule.startDate} to {activeRule.endDate}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Room Types:{' '}
              {(activeRule.roomTypes || []).length
                ? activeRule.roomTypes.join(', ')
                : 'All room types'}
            </p>
            <button
              type="button"
              onClick={onEditRule}
              className="mt-2 inline-flex items-center justify-center h-7 px-3 rounded-full text-[11px] font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
            >
              Edit Room Type Assignment
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

