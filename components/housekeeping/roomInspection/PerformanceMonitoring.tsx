import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface PerformanceInspection {
  id: string
  inspector: string
  status: string
  issuesCount: number
  scheduledDate: string
}

interface PerformanceMonitoringProps {
  inspections: PerformanceInspection[]
}

export function PerformanceMonitoring({ inspections }: PerformanceMonitoringProps) {
  const byInspector = new Map<
    string,
    { total: number; completed: number; issues: number; pending: number }
  >()

  inspections.forEach((i) => {
    const key = i.inspector || "Unassigned"
    const entry =
      byInspector.get(key) || { total: 0, completed: 0, issues: 0, pending: 0 }
    entry.total += 1
    if (i.status === "Completed") entry.completed += 1
    if (i.status === "Issues Reported" || i.issuesCount > 0) entry.issues += 1
    if (i.status === "Pending") entry.pending += 1
    byInspector.set(key, entry)
  })

  const rows = Array.from(byInspector.entries()).map(([name, stats]) => {
    const resolved = stats.completed
    const resolutionRate =
      stats.total > 0 ? Math.round((resolved / stats.total) * 100) : 0
    return { name, ...stats, resolutionRate }
  })

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-900">
          Performance monitoring
        </CardTitle>
        <p className="text-[11px] text-slate-500">
          Inspector-wise completion and issue trends.
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs">
        {rows.length === 0 ? (
          <p className="text-slate-500 text-xs">
            No inspection data available yet to calculate performance.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Inspector
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Total
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Completed
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    With issues
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Pending
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Resolution rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  let rateColor = "bg-slate-100 text-slate-800"
                  if (row.resolutionRate >= 90) rateColor = "bg-emerald-50 text-emerald-700"
                  else if (row.resolutionRate >= 70)
                    rateColor = "bg-amber-50 text-amber-700"
                  else rateColor = "bg-rose-50 text-rose-700"

                  return (
                    <tr
                      key={row.name}
                      className="border-b border-slate-100 hover:bg-slate-50/60"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{row.total}</td>
                      <td className="px-3 py-2 text-slate-700">{row.completed}</td>
                      <td className="px-3 py-2 text-slate-700">{row.issues}</td>
                      <td className="px-3 py-2 text-slate-700">{row.pending}</td>
                      <td className="px-3 py-2">
                        <Badge className={`text-[10px] ${rateColor}`}>
                          {row.resolutionRate}%
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

