'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AccessControlPage() {
  const accessList = [
    { id: 1, user: 'John Smith', role: 'General Manager', properties: 'All', accessLevel: 'Full Control', status: 'Active' },
    { id: 2, user: 'Emma Davis', role: 'Property Manager', properties: 'Downtown, Airport', accessLevel: 'Admin', status: 'Active' },
    { id: 3, user: 'Michael Brown', role: 'Staff', properties: 'Beach Paradise', accessLevel: 'Limited', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">User Access Control</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage user access across properties</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            Grant Access
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">User</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Properties</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Access Level</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accessList.map((access) => (
                    <tr key={access.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{access.user}</td>
                      <td className="py-2 px-2 text-gray-700">{access.role}</td>
                      <td className="py-2 px-2 text-gray-700">{access.properties}</td>
                      <td className="py-2 px-2 text-gray-700">{access.accessLevel}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {access.status}
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
