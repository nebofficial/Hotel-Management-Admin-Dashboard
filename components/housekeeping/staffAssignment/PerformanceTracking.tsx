"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StaffMemberRecord, StaffScheduleRecord } from "./StaffAssignment"

interface PerformanceTrackingProps {
  staff: StaffMemberRecord[]
  schedules: StaffScheduleRecord[]
}

export function PerformanceTracking({
  staff,
  schedules,
}: PerformanceTrackingProps) {
  const metrics = useMemo(() => {
    const byStaff: Record<
      string,
      {
        name: string
        role: string
        totalTasks: number
        rooms: number
        inspectionsPassed: number
        inspectionsFailed: number
        performanceScore: number
      }
    > = {}

    schedules.forEach((s) => {
      const key = s.staffId
      if (!byStaff[key]) {
        const member = staff.find((m) => m.id === s.staffId)
        byStaff[key] = {
          name: member?.name || s.staffName,
          role: member?.role || s.role,
          totalTasks: 0,
          rooms: 0,
          inspectionsPassed: 0,
          inspectionsFailed: 0,
          performanceScore: 0,
        }
      }
      byStaff[key].totalTasks += s.assignedTasks || 0
      byStaff[key].rooms += s.assignedRooms || 0
      byStaff[key].inspectionsPassed += s.inspectionsPassed || 0
      byStaff[key].inspectionsFailed += s.inspectionsFailed || 0
      byStaff[key].performanceScore += s.performanceScore || 0
    })

    const rows = Object.values(byStaff)
    const totalScore = rows.reduce((sum, r) => sum + r.performanceScore, 0)
    const avgScore = rows.length ? totalScore / rows.length : 0

    return {
      rows,
      avgScore,
      totalStaff: rows.length,
    }
  }, [staff, schedules])

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-sm border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Performance highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-[11px] flex flex-wrap gap-4">
          <div>
            <p className="opacity-90">Staff with performance data</p>
            <p className="text-lg font-semibold">{metrics.totalStaff}</p>
          </div>
          <div>
            <p className="opacity-90">Average score</p>
            <p className="text-lg font-semibold">
              {metrics.avgScore.toFixed(1)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Staff performance overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[11px] text-slate-500 border-b border-slate-100">
                  <th className="py-2 px-2 text-left font-medium">Staff</th>
                  <th className="py-2 px-2 text-left font-medium hidden md:table-cell">
                    Role
                  </th>
                  <th className="py-2 px-2 text-right font-medium hidden md:table-cell">
                    Rooms
                  </th>
                  <th className="py-2 px-2 text-right font-medium">
                    Tasks
                  </th>
                  <th className="py-2 px-2 text-right font-medium hidden md:table-cell">
                    Inspections
                  </th>
                  <th className="py-2 px-2 text-right font-medium">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 px-2 text-[11px] text-slate-500 text-center"
                    >
                      No performance data yet. As you start assigning work and
                      inspections, this section will visualize staff efficiency.
                    </td>
                  </tr>
                )}
                {metrics.rows.map((row) => {
                  const inspTotal =
                    row.inspectionsPassed + row.inspectionsFailed || 0
                  const inspBadgeColor =
                    row.inspectionsFailed === 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"

                  const scoreBadgeColor =
                    row.performanceScore >= metrics.avgScore
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-50 text-slate-600 border-slate-200"

                  return (
                    <tr
                      key={row.name + row.role}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2 px-2 text-slate-900 font-medium">
                        {row.name}
                      </td>
                      <td className="py-2 px-2 hidden md:table-cell text-slate-600">
                        {row.role}
                      </td>
                      <td className="py-2 px-2 text-right hidden md:table-cell text-slate-700">
                        {row.rooms}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-700">
                        {row.totalTasks}
                      </td>
                      <td className="py-2 px-2 text-right hidden md:table-cell">
                        <Badge
                          className={`text-[10px] border ${inspBadgeColor}`}
                        >
                          {row.inspectionsPassed}/{inspTotal}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Badge
                          className={`text-[10px] border ${scoreBadgeColor}`}
                        >
                          {row.performanceScore.toFixed(1)}
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
    </section>
  )
}

