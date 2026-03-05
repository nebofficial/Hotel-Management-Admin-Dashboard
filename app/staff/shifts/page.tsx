'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ShiftsPage() {
  const shifts = [
    { id: 1, shiftName: 'Morning Shift', startTime: '6:00 AM', endTime: '2:00 PM', staffCount: '8', status: 'Active' },
    { id: 2, shiftName: 'Evening Shift', startTime: '2:00 PM', endTime: '10:00 PM', staffCount: '10', status: 'Active' },
    { id: 3, shiftName: 'Night Shift', startTime: '10:00 PM', endTime: '6:00 AM', staffCount: '5', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Shift Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage staff shifts and timings</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 cursor-pointer hover:bg-red-700">
            <Plus className="w-3.5 h-3.5 " />
            New Shift
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Shift</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Start Time</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">End Time</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Staff Count</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr key={shift.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{shift.shiftName}</td>
                      <td className="py-2 px-2 text-gray-700">{shift.startTime}</td>
                      <td className="py-2 px-2 text-gray-700">{shift.endTime}</td>
                      <td className="py-2 px-2 text-center font-medium">{shift.staffCount}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {shift.status}
                        </span>
                      </td>
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
