'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function DepartmentPerformanceAnalysis({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-red-600/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-red-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Department Performance</CardTitle>
        <p className="text-[11px] text-slate-500">Department-level productivity.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : !data.length ? (
          <p className="text-xs text-slate-500 py-6 text-center">No department data</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/80 border border-red-100"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800">{d.department}</p>
                  <p className="text-[10px] text-slate-500">
                    Attendance: {d.attendanceRate?.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase text-slate-500">Sales</p>
                  <p className="text-sm font-semibold text-red-600">₹{formatCurrency(d.totalSales)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

