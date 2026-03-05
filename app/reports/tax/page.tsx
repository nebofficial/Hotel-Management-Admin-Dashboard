'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TaxReportPage() {
  const taxData = [
    { taxType: 'GST', rate: '18%', amount: '$8,100', status: 'Due' },
    { taxType: 'Service Charge', rate: '10%', amount: '$4,500', status: 'Collected' },
    { taxType: 'VAT', rate: '12%', amount: '$5,400', status: 'Collected' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Tax Report</h1>
          <p className="text-xs text-gray-500 mt-0.5">Monthly tax summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Tax Collected</p>
              <div className="text-2xl font-bold text-gray-900">$18,000</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Tax Due</p>
              <div className="text-2xl font-bold text-red-600">$8,100</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Tax Paid</p>
              <div className="text-2xl font-bold text-green-600">$9,900</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Tax Type</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Rate</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Amount</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.map((tax, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{tax.taxType}</td>
                      <td className="py-2 px-2 text-center">{tax.rate}</td>
                      <td className="py-2 px-2 text-right font-bold">{tax.amount}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tax.status === 'Collected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tax.status}
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
