"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AttendanceStatus,
  StaffMemberRecord,
  StaffScheduleRecord,
  StaffRole,
  StaffShift,
} from "./StaffAssignment"

interface AttendanceTrackingProps {
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

const ATTENDANCE_COLORS: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Absent: "bg-rose-50 text-rose-700 border-rose-100",
  "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
  Off: "bg-slate-50 text-slate-600 border-slate-200",
}

export function AttendanceTracking({
  date,
  staff,
  schedules,
  saving,
  onSaveSchedule,
}: AttendanceTrackingProps) {
  const getScheduleForStaff = (staffId: string): StaffScheduleRecord | undefined =>
    schedules.find((s) => s.staffId === staffId && s.date === date)

  const handleAttendanceChange = async (
    staffMember: StaffMemberRecord,
    status: AttendanceStatus,
  ) => {
    const existing = getScheduleForStaff(staffMember.id)
    await onSaveSchedule({
      ...(existing || {}),
      staffId: staffMember.id,
      staffName: staffMember.name,
      date,
      role: (staffMember.role as StaffRole) || "Housekeeping",
      shift: (existing?.shift as StaffShift) || "Morning",
      attendanceStatus: status,
    })
  }

  const handleHoursChange = async (
    staffMember: StaffMemberRecord,
    hours: number,
  ) => {
    const existing = getScheduleForStaff(staffMember.id)
    await onSaveSchedule({
      ...(existing || {}),
      staffId: staffMember.id,
      staffName: staffMember.name,
      date,
      role: (staffMember.role as StaffRole) || "Housekeeping",
      shift: (existing?.shift as StaffShift) || "Morning",
      attendanceStatus: (existing?.attendanceStatus as AttendanceStatus) || "Present",
      hoursWorked: hours,
    })
  }

  const presentCount = schedules.filter(
    (s) => s.date === date && s.attendanceStatus === "Present",
  ).length
  const absentCount = schedules.filter(
    (s) => s.date === date && s.attendanceStatus === "Absent",
  ).length

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-sm border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Attendance snapshot for {date}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-[11px] flex flex-wrap gap-3">
          <div>
            <p className="opacity-90">Present</p>
            <p className="text-lg font-semibold">{presentCount}</p>
          </div>
          <div>
            <p className="opacity-90">Absent</p>
            <p className="text-lg font-semibold">{absentCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Daily attendance & hours
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
                  <th className="py-2 px-2 text-left font-medium">Attendance</th>
                  <th className="py-2 px-2 text-right font-medium">
                    Hours worked
                  </th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 px-2 text-[11px] text-slate-500 text-center"
                    >
                      No staff members available. Add staff in the Roles tab first.
                    </td>
                  </tr>
                )}
                {staff.map((m) => {
                  const schedule = getScheduleForStaff(m.id)
                  const status: AttendanceStatus =
                    (schedule?.attendanceStatus as AttendanceStatus) || "Present"
                  const hours = schedule?.hoursWorked ?? 0

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
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={`text-[10px] border ${ATTENDANCE_COLORS[status]}`}
                          >
                            {status}
                          </Badge>
                          <select
                          title="Attendance"
                            className="h-7 text-[11px] rounded-md border border-slate-200 bg-white px-1.5"
                            value={status}
                            disabled={saving}
                            onChange={(e) =>
                              handleAttendanceChange(
                                m,
                                e.target.value as AttendanceStatus,
                              )
                            }
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Off">Off</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                        title="Hours worked"
                          type="number"
                          min={0}
                          step={0.5}
                          className="h-7 w-20 text-right text-[11px] rounded-md border border-slate-200 bg-white px-1.5"
                          value={hours}
                          disabled={saving}
                          onChange={(e) =>
                            handleHoursChange(m, Number(e.target.value || 0))
                          }
                        />
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

