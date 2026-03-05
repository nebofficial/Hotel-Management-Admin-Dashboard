"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StaffMemberRecord, StaffScheduleRecord, StaffRole, StaffShift } from "./StaffAssignment"

interface ShiftManagementProps {
  date: string
  onChangeDate: (date: string) => void
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

const SHIFT_COLORS: Record<StaffShift, string> = {
  Morning: "bg-amber-50 text-amber-700 border-amber-100",
  Afternoon: "bg-sky-50 text-sky-700 border-sky-100",
  Night: "bg-violet-50 text-violet-700 border-violet-100",
}

export function ShiftManagement({
  date,
  onChangeDate,
  staff,
  schedules,
  saving,
  onSaveSchedule,
}: ShiftManagementProps) {
  const getScheduleForStaff = (staffId: string): StaffScheduleRecord | undefined =>
    schedules.find((s) => s.staffId === staffId && s.date === date)

  const handleShiftChange = async (staffMember: StaffMemberRecord, shift: StaffShift) => {
    const existing = getScheduleForStaff(staffMember.id)
    await onSaveSchedule({
      ...(existing || {}),
      staffId: staffMember.id,
      staffName: staffMember.name,
      date,
      shift,
      role: (staffMember.role as StaffRole) || "Housekeeping",
    })
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            Daily shift planner
          </CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Select date</span>
            <Input
              type="date"
              value={date}
              onChange={(e) => onChangeDate(e.target.value)}
              className="h-8 text-xs w-[140px]"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0 text-xs text-slate-600">
          <p className="mb-2">
            Assign each staff member to a morning, afternoon, or night shift. Colors
            help you quickly identify coverage across the day.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Shifts for {date}
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
                  <th className="py-2 px-2 text-left font-medium">Shift</th>
                  <th className="py-2 px-2 text-right font-medium">Actions</th>
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
                  const currentShift: StaffShift = schedule?.shift || "Morning"

                  return (
                    <tr
                      key={m.id}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2 px-2 text-slate-900 font-medium">
                        {m.name}
                      </td>
                      <td className="py-2 px-2 hidden md:table-cell">
                        <Badge className="bg-slate-50 text-slate-700 border-slate-200 text-[10px]">
                          {m.role}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={`text-[10px] border ${SHIFT_COLORS[currentShift]}`}
                          >
                            {currentShift}
                          </Badge>
                          <select
                            className="h-7 text-[11px] rounded-md border border-slate-200 bg-white px-1.5"
                            value={currentShift}
                            disabled={saving}
                            onChange={(e) =>
                              handleShiftChange(m, e.target.value as StaffShift)
                            }
                          >
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Night">Night</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right text-[11px] text-slate-500">
                        {schedule ? "Scheduled" : "New schedule"}
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

