'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function PropertyReportsPage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Property-wise Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">Comparative analysis across properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Properties</p>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Combined Revenue</p>
              <div className="text-2xl font-bold text-gray-900">$39,500</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Avg Occupancy</p>
              <div className="text-2xl font-bold text-gray-900">85%</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600">Detailed property-wise reports will be displayed here with comparative metrics and trends.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
