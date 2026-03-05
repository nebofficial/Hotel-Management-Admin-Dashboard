'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign } from 'lucide-react'

export default function SupplierReport({ data }) {
  const report = data?.report || []

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Users className="h-5 w-5" />
          Supplier Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {report.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No supplier data available</p>
        ) : (
          <div className="space-y-2">
            {report.slice(0, 10).map((item) => (
              <div key={item.supplier.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{item.supplier.supplierName}</p>
                  <p className="text-xs text-gray-500">{item.totalOrders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">${item.totalAmount.toFixed(2)}</p>
                  {item.outstanding > 0 && (
                    <p className="text-xs text-red-600">Due: ${item.outstanding.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
