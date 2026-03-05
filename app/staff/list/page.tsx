'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StaffListPage() {
  const staff = [
    { id: 1, name: "Maria Garcia", role: "Front Desk", department: "Reception", status: "Active" },
    { id: 2, name: "John Smith", role: "Housekeeping Lead", department: "Housekeeping", status: "Active" },
    { id: 3, name: "Rosa Williams", role: "Housekeeper", department: "Housekeeping", status: "Active" },
    { id: 4, name: "Chef Michael", role: "Head Chef", department: "Restaurant", status: "Active" },
    { id: 5, name: "David Brown", role: "Waiter", department: "Restaurant", status: "On Leave" },
  ]

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Staff List</h1>
        <p className="text-xs text-gray-500 mt-0.5">All hotel staff members</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Staff (5)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.department}</p>
                </div>
                <div className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getStatusColor(member.status)}`}>
                  {member.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
