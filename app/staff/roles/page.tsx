'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2 } from 'lucide-react'

export default function RolesPage() {
  const roles = [
    { id: 1, name: 'Manager', description: 'Hotel Manager', permissions: '12', status: 'Active' },
    { id: 2, name: 'Front Desk', description: 'Front Desk Officer', permissions: '8', status: 'Active' },
    { id: 3, name: 'Housekeeper', description: 'Housekeeping Staff', permissions: '5', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Roles & Permissions</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage staff roles and permissions</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            New Role
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Role Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Description</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Permissions</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{role.name}</td>
                      <td className="py-2 px-2 text-gray-700">{role.description}</td>
                      <td className="py-2 px-2 text-center">{role.permissions}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {role.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
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
