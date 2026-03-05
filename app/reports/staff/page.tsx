'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaffPerformancePage() {
  const staff = [
    { id: 1, name: 'John Smith', department: 'Front Desk', rating: '4.8/5', tasks: '95%', attendance: '98%' },
    { id: 2, name: 'Emma Davis', department: 'Housekeeping', rating: '4.6/5', tasks: '92%', attendance: '96%' },
    { id: 3, name: 'Michael Brown', department: 'Restaurant', rating: '4.7/5', tasks: '94%', attendance: '97%' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Staff Performance</h1>
          <p className="text-xs text-gray-500 mt-0.5">Performance metrics and ratings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Avg Rating</p>
              <div className="text-2xl font-bold text-gray-900">4.7/5</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Avg Attendance</p>
              <div className="text-2xl font-bold text-green-600">97%</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Avg Task Completion</p>
              <div className="text-2xl font-bold text-gray-900">94%</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Staff Ratings</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Department</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Rating</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Task Completion</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{member.name}</td>
                      <td className="py-2 px-2 text-gray-700">{member.department}</td>
                      <td className="py-2 px-2 text-center font-bold text-amber-600">{member.rating}</td>
                      <td className="py-2 px-2 text-center">{member.tasks}</td>
                      <td className="py-2 px-2 text-center text-green-600 font-medium">{member.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
