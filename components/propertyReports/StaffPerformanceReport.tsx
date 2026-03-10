"use client"

import { Card, CardContent } from "@/components/ui/card"

interface StaffPerformanceReportProps {
  data: {
    attendance?: any[]
    tasks?: any[]
    sales?: any[]
  }
  loading?: boolean
}

export function StaffPerformanceReport({ data, loading }: StaffPerformanceReportProps) {
  const attendanceCount = data?.attendance?.length ?? 0
  const tasksCount = data?.tasks?.length ?? 0
  const salesCount = data?.sales?.length ?? 0

  return (
    <div className="rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">
        Staff Performance
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Attendance records</p>
            <p className="mt-1 text-xl font-bold">{loading ? "—" : attendanceCount}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Tasks</p>
            <p className="mt-1 text-xl font-bold">{loading ? "—" : tasksCount}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Sales entries</p>
            <p className="mt-1 text-xl font-bold">{loading ? "—" : salesCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

