'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock } from 'lucide-react'

export default function ExpiryReport({ data }) {
  const expired = data?.expired || []
  const nearExpiry = data?.nearExpiry || []

  return (
    <Card className="bg-gradient-to-br from-red-50 to-yellow-50 border-red-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="h-5 w-5" />
          Expiry Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-100 p-3 rounded-lg border border-red-300">
            <p className="text-xs text-red-700 mb-1">Expired Items</p>
            <p className="text-2xl font-bold text-red-700">{expired.length}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
            <p className="text-xs text-yellow-700 mb-1">Near Expiry (30 days)</p>
            <p className="text-2xl font-bold text-yellow-700">{nearExpiry.length}</p>
          </div>
        </div>
        {expired.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-red-700 mb-2">Expired Items</p>
            <div className="space-y-2">
              {expired.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                  <span className="text-xs text-red-600">{new Date(item.expiryDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {nearExpiry.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-yellow-700 mb-2">Near Expiry Items</p>
            <div className="space-y-2">
              {nearExpiry.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                  <span className="text-xs text-yellow-600">{new Date(item.expiryDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
