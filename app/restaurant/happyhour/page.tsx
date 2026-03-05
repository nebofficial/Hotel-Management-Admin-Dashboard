'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const happyHourItems = [
  { id: 1, item: 'Beer', originalPrice: '$5', happyHourPrice: '$3.50', discount: '30%' },
  { id: 2, item: 'Wine', originalPrice: '$8', happyHourPrice: '$5.50', discount: '31%' },
  { id: 3, item: 'Cocktails', originalPrice: '$10', happyHourPrice: '$6.50', discount: '35%' },
]

export default function HappyHourPage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Happy Hour Pricing</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage happy hour discounts and pricing</p>
        </div>

        <Card className="border border-blue-200 shadow-xs bg-blue-50">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-blue-900">Happy Hour: 5 PM - 7 PM Daily</p>
            <p className="text-xs text-blue-800 mt-1">Special discounts on selected beverages</p>
          </CardContent>
        </Card>

        <div className="bg-white border border-gray-200 rounded-md">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Item</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Original Price</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Happy Hour Price</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Discount</th>
              </tr>
            </thead>
            <tbody>
              {happyHourItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{item.item}</td>
                  <td className="px-3 py-2 text-gray-600">{item.originalPrice}</td>
                  <td className="px-3 py-2 font-medium text-green-600">{item.happyHourPrice}</td>
                  <td className="px-3 py-2 font-medium text-blue-600">{item.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
