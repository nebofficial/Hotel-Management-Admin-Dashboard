'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2 } from 'lucide-react'

export default function SeasonalPricingPage() {
  const seasons = [
    { id: 1, season: 'Peak Season', months: 'Dec-Jan', standard: '$250', deluxe: '$350', suite: '$500', status: 'Active' },
    { id: 2, season: 'High Season', months: 'Mar-Apr', standard: '$180', deluxe: '$260', suite: '$380', status: 'Active' },
    { id: 3, season: 'Low Season', months: 'May-Sep', standard: '$120', deluxe: '$170', suite: '$250', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Seasonal Pricing</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage seasonal rate plans</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            New Season
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Season</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Months</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Standard</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Deluxe</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Suite</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((season) => (
                    <tr key={season.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{season.season}</td>
                      <td className="py-2 px-2 text-gray-700">{season.months}</td>
                      <td className="py-2 px-2 text-right font-medium">{season.standard}</td>
                      <td className="py-2 px-2 text-right font-medium">{season.deluxe}</td>
                      <td className="py-2 px-2 text-right font-medium">{season.suite}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {season.status}
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
