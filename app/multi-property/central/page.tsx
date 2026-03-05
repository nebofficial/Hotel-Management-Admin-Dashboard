'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function CentralDashboardPage() {
  const properties = [
    { id: 1, name: 'Downtown Hotel', occupancy: '85%', revenue: '$12,500', guests: '68', status: 'Operational' },
    { id: 2, name: 'Airport Resort', occupancy: '92%', revenue: '$15,800', guests: '92', status: 'Operational' },
    { id: 3, name: 'Beach Paradise', occupancy: '78%', revenue: '$11,200', guests: '52', status: 'Operational' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Central Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Overview of all properties</p>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Property</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Occupancy</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Revenue</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Guests</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{property.name}</td>
                      <td className="py-2 px-2 text-center font-medium">{property.occupancy}</td>
                      <td className="py-2 px-2 text-right font-bold">{property.revenue}</td>
                      <td className="py-2 px-2 text-center">{property.guests}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {property.status}
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
