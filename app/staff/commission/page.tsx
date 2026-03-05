'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'

export default function CommissionPage() {
  const commissions = [
    { id: 1, roleType: 'Receptionist', baseRate: '2%', minAmount: '$500', status: 'Active' },
    { id: 2, roleType: 'Housekeeping', baseRate: '1.5%', minAmount: '$300', status: 'Active' },
    { id: 3, roleType: 'Restaurant Staff', baseRate: '3%', minAmount: '$1000', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Commission Setup</h1>
            <p className="text-xs text-gray-500 mt-0.5">Configure staff commission rates</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            New Commission
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Role Type</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Commission Rate</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Minimum Amount</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{commission.roleType}</td>
                      <td className="py-2 px-2 text-center font-bold">{commission.baseRate}</td>
                      <td className="py-2 px-2 text-right">{commission.minAmount}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {commission.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Settings className="w-3.5 h-3.5" />
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
