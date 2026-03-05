'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'

export default function CheckInOutRulesPage() {
  const rules = [
    { id: 1, rule: 'Standard Check-in Time', value: '2:00 PM', status: 'Active' },
    { id: 2, rule: 'Standard Check-out Time', value: '11:00 AM', status: 'Active' },
    { id: 3, rule: 'Late Check-out Charges', value: '50% of room rate/hour', status: 'Active' },
    { id: 4, rule: 'Early Check-in Charges', value: '50% of room rate/hour', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Check-in / Check-out Rules</h1>
          <p className="text-xs text-gray-500 mt-0.5">Define hotel operational rules</p>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Rule</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Value</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{rule.rule}</td>
                      <td className="py-2 px-2 text-gray-700">{rule.value}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {rule.status}
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
