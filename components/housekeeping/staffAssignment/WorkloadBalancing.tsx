"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  StaffMemberRecord,
  StaffScheduleRecord,
  StaffRole,
  StaffShift,
} from "./StaffAssignment"

interface WorkloadBalancingProps {
  date: string
  staff: StaffMemberRecord[]
  schedules: StaffScheduleRecord[]
  saving: boolean
  onSaveSchedule: (
    record: Partial<StaffScheduleRecord> & {
      staffId: string
      staffName: string
      date: string
    },
  ) => Promise<void> | void
}

export function WorkloadBalancing({
  date,
  staff,
  schedules,
  saving,
  onSaveSchedule,
}: WorkloadBalancingProps) {
  const todaysSchedules = useMemo(
    () => schedules.filter((s) => s.date === date),
    [schedules, date],
  )

  const totalRooms = todaysSchedules.reduce(
    (sum, s) => sum + (s.assignedRooms || 0),
    0,
  )

  const totalTasks = todaysSchedules.reduce(
    (sum, s) => sum + (s.assignedTasks || 0),
    0,
  )

  const autoBalance = async () => {
    if (staff.length === 0) return

    // Simple balancing: spread total assigned rooms/tasks evenly across all active staff
    const activeStaff = staff.filter((s) => s.isActive)
    if (activeStaff.length === 0) return

    const roomsPerStaff = totalRooms > 0 ? Math.round(totalRooms / activeStaff.length) : 0
    const tasksPerStaff = totalTasks > 0 ? Math.round(totalTasks / activeStaff.length) : 0

    for (const member of activeStaff) {
      const existing = todaysSchedules.find((s) => s.staffId === member.id)
      await onSaveSchedule({
        ...(existing || {}),
        staffId: member.id,
        staffName: member.name,
        date,
        role: (member.role as StaffRole) || "Housekeeping",
        shift: (existing?.shift as StaffShift) || "Morning",
        assignedRooms: roomsPerStaff,
        assignedTasks: tasksPerStaff,
        workloadScore: roomsPerStaff + tasksPerStaff,
      })
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-sm border-none">
        <CardHeader className="pb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            Smart workload balancing
          </CardTitle>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20 border border-white/30"
            disabled={saving || staff.length === 0}
            onClick={autoBalance}
          >
            {saving ? "Balancing..." : "Auto-balance workload"}
          </Button>
        </CardHeader>
        <CardContent className="pt-0 text-[11px] space-y-1">
          <p className="opacity-90">
            Distribute rooms and housekeeping tasks evenly across active staff to
            avoid overloading any single team member.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-black/15 text-[10px]">
              Total rooms today: <span className="font-semibold">{totalRooms}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/15 text-[10px]">
              Total tasks today: <span className="font-semibold">{totalTasks}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/15 text-[10px]">
              Active staff:{" "}
              <span className="font-semibold">
                {staff.filter((s) => s.isActive).length}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Workload overview for {date}
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
                  <th className="py-2 px-2 text-right font-medium">
                    Rooms assigned
                  </th>
                  <th className="py-2 px-2 text-right font-medium hidden md:table-cell">
                    Tasks
                  </th>
                  <th className="py-2 px-2 text-right font-medium">Workload</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-2 text-[11px] text-slate-500 text-center"
                    >
                      No staff members available. Add staff in the Roles tab first.
                    </td>
                  </tr>
                )}
                {staff.map((m) => {
                  const schedule = todaysSchedules.find(
                    (s) => s.staffId === m.id,
                  )
                  const rooms = schedule?.assignedRooms ?? 0
                  const tasks = schedule?.assignedTasks ?? 0
                  const workload = schedule?.workloadScore ?? rooms + tasks

                  const workloadColor =
                    workload === 0
                      ? "bg-slate-50 text-slate-600 border-slate-200"
                      : workload < 10
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : workload < 20
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"

                  return (
                    <tr
                      key={m.id}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2 px-2 text-slate-900 font-medium">
                        {m.name}
                      </td>
                      <td className="py-2 px-2 hidden md:table-cell text-slate-600">
                        {m.role}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-700">
                        {rooms}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-700 hidden md:table-cell">
                        {tasks}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Badge
                          className={`text-[10px] border ${workloadColor}`}
                        >
                          {workload}
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

