"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface ReportingTask {
  id: string
  loadNumber: string
  itemType: string
  quantity: number
  status: string
  scheduledDate: string
  completedAt: string | null
  assignedTo: string | null
  assignedType: string
}

interface ReportingAnalyticsProps {
  tasks: ReportingTask[]
}

export function ReportingAnalytics({ tasks }: ReportingAnalyticsProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === "Completed").length
  const inProgress = tasks.filter(
    (t) => !["Pending", "Completed"].includes(t.status),
  ).length
  const pending = tasks.filter((t) => t.status === "Pending").length

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const byItemType = new Map<string, { total: number; completed: number }>()
  tasks.forEach((t) => {
    const entry = byItemType.get(t.itemType) || { total: 0, completed: 0 }
    entry.total += 1
    if (t.status === "Completed") entry.completed += 1
    byItemType.set(t.itemType, entry)
  })

  const byAssignee = new Map<string, { total: number; completed: number }>()
  tasks.forEach((t) => {
    const key = t.assignedTo || "Unassigned"
    const entry = byAssignee.get(key) || { total: 0, completed: 0 }
    entry.total += 1
    if (t.status === "Completed") entry.completed += 1
    byAssignee.set(key, entry)
  })

  const recentCompleted = tasks
    .filter((t) => t.status === "Completed" && t.completedAt)
    .sort((a, b) => {
      const da = a.completedAt ? new Date(a.completedAt).getTime() : 0
      const db = b.completedAt ? new Date(b.completedAt).getTime() : 0
      return db - da
    })
    .slice(0, 10)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="space-y-3 lg:col-span-1">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Performance metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs space-y-2">
            <Metric label="Total loads" value={total} />
            <Metric label="Completed" value={completed} />
            <Metric label="In progress" value={inProgress} />
            <Metric label="Pending" value={pending} />
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-500">Completion rate</p>
              <p className="text-lg font-bold text-emerald-600">{completionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Performance by item type
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs">
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Item type
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Total</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Completed
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Rate</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(byItemType.entries()).map(([type, stats]) => {
                  const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
                  return (
                    <tr key={type} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="px-3 py-2 font-medium text-slate-900">{type}</td>
                      <td className="px-3 py-2 text-slate-700">{stats.total}</td>
                      <td className="px-3 py-2 text-slate-700">{stats.completed}</td>
                      <td className="px-3 py-2">
                        <Badge
                          className={
                            rate >= 80
                              ? "bg-emerald-50 text-emerald-700"
                              : rate >= 60
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }
                          style={{ fontSize: "10px" }}
                        >
                          {rate}%
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-3">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Recent completions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs">
          {recentCompleted.length === 0 ? (
            <p className="text-slate-500">No completed loads yet.</p>
          ) : (
            <div className="space-y-1.5">
              {recentCompleted.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 border border-slate-100"
                >
                  <div>
                    <span className="font-medium text-slate-900">{t.loadNumber}</span>
                    <p className="text-[11px] text-slate-600">
                      {t.itemType} • {t.quantity} items • {t.assignedTo || "Unassigned"}
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricProps {
  label: string
  value: number | string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}
