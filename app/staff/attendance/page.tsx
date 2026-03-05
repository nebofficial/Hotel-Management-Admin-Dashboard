'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default function AttendancePage() {
  const attendance = [
    { id: 1, name: "Maria Garcia", date: "2024-01-29", status: "Present", time: "08:00" },
    { id: 2, name: "John Smith", date: "2024-01-29", status: "Absent", time: "-" },
    { id: 3, name: "Rosa Williams", date: "2024-01-29", status: "Present", time: "08:15" },
    { id: 4, name: "Chef Michael", date: "2024-01-29", status: "Late", time: "09:30" },
    { id: 5, name: "David Brown", date: "2024-01-29", status: "Present", time: "08:00" },
  ]

  const getStatusIcon = (status: string) => {
    if (status === "Present") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "Late") return <Clock className="w-4 h-4 text-orange-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  const getStatusColor = (status: string) => {
    if (status === "Present") return "bg-green-100 text-green-800"
    if (status === "Late") return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Attendance</h1>
        <p className="text-xs text-gray-500 mt-0.5">Daily staff attendance tracking</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Today's Attendance (5)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {attendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStatusIcon(record.status)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{record.name}</p>
                    <p className="text-xs text-gray-600">{record.time}</p>
                  </div>
                </div>
                <div className={`text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${getStatusColor(record.status)}`}>
                  {record.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
